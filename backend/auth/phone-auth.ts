import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { ROLES, UserRole } from '@/backend/constants/roles';
import { mockStore } from '@/backend/db/mock-store';
import { ConflictError, ValidationError } from '@/backend/errors/app-error';

/**
 * Phone + password accounts.
 *
 * Stored in a JSON file (.data/users.json locally, /tmp on serverless) so accounts survive
 * restarts. Passwords and reset codes are stored only as hashes.
 *
 * There are no demo accounts: every account is registered by a real user.
 * The owner super admin is created from SUPERADMIN_PHONE + SUPERADMIN_PASSWORD.
 */

export interface PhoneUserRecord {
  id: string;
  username: string;
  countryCode: string;
  phoneNumber: string;
  fullPhoneNumber: string;
  passwordHash: string;
  fullName: string;
  email: string;
  role: UserRole;
  createdAt: string;
  passwordChangedAt?: string;
  demo?: boolean;
}

interface OtpRecord {
  codeHash: string;
  expiresAt: number;
  sentAt: number;
  attempts: number;
}

interface PhoneAuthData {
  users: Record<string, PhoneUserRecord>;
  otps: Record<string, OtpRecord>;
}

export const OTP_TTL_MS = 10 * 60 * 1000;
export const OTP_RESEND_COOLDOWN_MS = 60 * 1000;
const OTP_MAX_ATTEMPTS = 5;
export const MIN_PASSWORD_LENGTH = 6;

declare global {
  // eslint-disable-next-line no-var
  var __phoneAuthStore: PhoneAuthStore | undefined;
}

/* ------------------------------- hashing --------------------------------- */

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, 64);
  return `scrypt$${salt.toString('hex')}$${hash.toString('hex')}`;
}

export function verifyPasswordHash(password: string, stored: string): boolean {
  const [scheme, saltHex, hashHex] = stored.split('$');
  if (scheme !== 'scrypt' || !saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, 'hex');
  const actual = crypto.scryptSync(password, Buffer.from(saltHex, 'hex'), expected.length);
  return crypto.timingSafeEqual(actual, expected);
}

function hashOtp(code: string): string {
  return crypto.createHash('sha256').update(code).digest('hex');
}

/* ------------------------------- phones ---------------------------------- */

export function normalizePhone(countryCode: string, phoneNumber: string): { digits: string; full: string } {
  const cleanCode = countryCode.startsWith('+') ? countryCode : `+${countryCode}`;
  let cleanNumber = phoneNumber.replace(/\D/g, '');
  if (cleanNumber.startsWith('0')) {
    cleanNumber = cleanNumber.substring(1);
  }
  return {
    digits: cleanNumber,
    full: `${cleanCode}${cleanNumber}`,
  };
}

/** Exact candidate forms of a typed phone number (Ethiopian local formats included). */
function phoneCandidates(input: string): Set<string> {
  const digits = input.replace(/\D/g, '');
  const out = new Set<string>();
  if (digits.length < 7) return out;
  out.add(`+${digits}`);
  if (digits.startsWith('0') && digits.length === 10) out.add(`+251${digits.slice(1)}`);
  if (digits.length === 9 && (digits.startsWith('9') || digits.startsWith('7'))) out.add(`+251${digits}`);
  return out;
}

/* ------------------------------- storage --------------------------------- */

function getFilePath(): string {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NODE_ENV === 'production') {
    return path.join(os.tmpdir(), 'selam_users.json');
  }
  return path.join(process.cwd(), '.data', 'users.json');
}

function readFromDisk(): PhoneAuthData {
  try {
    const filePath = getFilePath();
    if (fs.existsSync(filePath)) {
      const parsed = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as Partial<PhoneAuthData>;
      return { users: parsed.users ?? {}, otps: parsed.otps ?? {} };
    }
  } catch {
    // Corrupt or unreadable file: start empty rather than crash sign-in.
  }
  return { users: {}, otps: {} };
}

export class PhoneAuthStore {
  private data: PhoneAuthData;

  constructor() {
    this.data = readFromDisk();
    this.applySeeds();
  }

  private save() {
    try {
      const filePath = getFilePath();
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch {
      // Read-only filesystem: the in-memory copy is still current.
    }
  }

  private applySeeds() {
    let changed = false;
    const now = new Date().toISOString();
    // Remove demo accounts saved by earlier versions (they all used the public password Password123).
    for (const [id, user] of Object.entries(this.data.users)) {
      if (user.demo) {
        delete this.data.users[id];
        changed = true;
      }
    }

    // Bootstrap the real super admin from the environment (password re-applied when it changes).
    const saPhone = process.env.SUPERADMIN_PHONE?.trim();
    const saPassword = process.env.SUPERADMIN_PASSWORD;
    if (saPhone && saPassword && saPassword.length >= 8) {
      // "+251911..." is used as is; a local number like "0911..." is treated as Ethiopian.
      const fullPhone = saPhone.startsWith('+')
        ? `+${saPhone.replace(/\D/g, '')}`
        : normalizePhone('+251', saPhone).full;
      const digits = fullPhone.startsWith('+251') ? fullPhone.slice(4) : fullPhone.slice(1);
      const id = 'superadmin-owner';
      const existing = this.data.users[id];
      if (!existing || !verifyPasswordHash(saPassword, existing.passwordHash) || existing.fullPhoneNumber !== fullPhone) {
        this.data.users[id] = {
          id,
          username: 'owner',
          countryCode: '+251',
          phoneNumber: digits,
          fullPhoneNumber: fullPhone,
          passwordHash: hashPassword(saPassword),
          fullName: process.env.SUPERADMIN_NAME?.trim() || 'Selam Kids Owner',
          email: 'owner@selamkids.com',
          role: ROLES.SUPERADMIN,
          createdAt: existing?.createdAt ?? now,
          passwordChangedAt: now,
        };
        changed = true;
      }
    }

    if (changed) this.save();
  }

  public register(params: {
    username: string;
    countryCode: string;
    phoneNumber: string;
    password: string;
    role?: UserRole;
    fullName?: string;
  }): PhoneUserRecord {
    const { digits, full } = normalizePhone(params.countryCode, params.phoneNumber);
    const cleanUsername = params.username.toLowerCase().trim();

    if (params.password.length < MIN_PASSWORD_LENGTH) {
      throw new ValidationError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`);
    }
    if (digits.length < 7) {
      throw new ValidationError('Please enter a valid phone number.');
    }

    for (const u of Object.values(this.data.users)) {
      if (u.username.toLowerCase() === cleanUsername) {
        throw new ConflictError(`Username "${params.username}" is already taken. Please choose another.`);
      }
      if (u.fullPhoneNumber === full) {
        throw new ConflictError(`Phone number ${full} is already registered. Please sign in instead.`);
      }
    }

    const id = `user-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
    const role = params.role || ROLES.KID;
    const fullName = params.fullName || params.username;
    const email = `${cleanUsername}@selamkids.com`;
    const createdAt = new Date().toISOString();

    const record: PhoneUserRecord = {
      id,
      username: cleanUsername,
      countryCode: params.countryCode,
      phoneNumber: digits,
      fullPhoneNumber: full,
      passwordHash: hashPassword(params.password),
      fullName,
      email,
      role,
      createdAt,
    };

    this.data.users[id] = record;
    this.save();
    this.syncToMockStore(record);
    return record;
  }

  /** Mirrors new accounts into the in-memory admin store so they appear in the admin console. */
  private syncToMockStore(record: PhoneUserRecord) {
    try {
      mockStore.profiles.unshift({
        id: record.id,
        email: record.email,
        full_name: record.fullName,
        avatar_url: null,
        status: 'ACTIVE',
        created_at: record.createdAt,
        updated_at: record.createdAt,
        deleted_at: null,
      });

      const roleObj = mockStore.roles.find((r: { name: string }) => r.name === record.role);
      if (roleObj) {
        mockStore.userRoles.unshift({
          id: `ur-${record.id}`,
          user_id: record.id,
          role_id: roleObj.id,
          assigned_by: 'self_register',
          created_at: record.createdAt,
        });
      }

      if (record.role === ROLES.KID) {
        mockStore.kids.unshift({
          id: `kid-${Date.now()}`,
          user_id: record.id,
          nickname: record.username,
          age: 9,
          grade_level: 'Grade 3',
          creature_name: 'Simba',
          creature_type: 'Mythic Lion',
          creature_image_url: null,
          orbs: 50,
          words_written: 0,
          reading_level: 'Adventurer',
          family_id: null,
          classroom_id: null,
          created_at: record.createdAt,
          updated_at: record.createdAt,
          deleted_at: null,
        });
      }
    } catch {
      // Mock store sync is optional.
    }
  }

  public findById(id: string): PhoneUserRecord | undefined {
    return this.data.users[id];
  }

  /** Exact match on phone number (any common format) or username. */
  public findByIdentifier(identifier: string): PhoneUserRecord | undefined {
    const raw = identifier.trim().toLowerCase();
    if (!raw) return undefined;
    const candidates = phoneCandidates(raw);
    for (const u of Object.values(this.data.users)) {
      if (candidates.has(u.fullPhoneNumber)) return u;
    }
    for (const u of Object.values(this.data.users)) {
      if (u.username.toLowerCase() === raw) return u;
    }
    return undefined;
  }

  public findByPhone(countryCode: string, phoneNumber: string): PhoneUserRecord | undefined {
    const { full } = normalizePhone(countryCode, phoneNumber);
    return Object.values(this.data.users).find((u) => u.fullPhoneNumber === full);
  }

  public verifyPassword(user: PhoneUserRecord, password: string): boolean {
    try {
      return verifyPasswordHash(password, user.passwordHash);
    } catch {
      return false;
    }
  }

  /**
   * Creates a one-time reset code for an existing account and returns it so the caller can
   * deliver it (Telegram bot). Returns null when the account doesn't exist or a code was sent
   * less than a minute ago.
   */
  public createOtp(user: PhoneUserRecord): { code: string } | { retryInMs: number } {
    const existing = this.data.otps[user.fullPhoneNumber];
    const now = Date.now();
    if (existing && now - existing.sentAt < OTP_RESEND_COOLDOWN_MS) {
      return { retryInMs: OTP_RESEND_COOLDOWN_MS - (now - existing.sentAt) };
    }
    const code = crypto.randomInt(0, 1_000_000).toString().padStart(6, '0');
    this.data.otps[user.fullPhoneNumber] = {
      codeHash: hashOtp(code),
      expiresAt: now + OTP_TTL_MS,
      sentAt: now,
      attempts: 0,
    };
    this.save();
    return { code };
  }

  private consumeOtp(fullPhone: string, code: string): boolean {
    const record = this.data.otps[fullPhone];
    if (!record) return false;
    if (Date.now() > record.expiresAt || record.attempts >= OTP_MAX_ATTEMPTS) {
      delete this.data.otps[fullPhone];
      this.save();
      return false;
    }
    const given = Buffer.from(hashOtp(code.trim()), 'hex');
    const expected = Buffer.from(record.codeHash, 'hex');
    if (given.length === expected.length && crypto.timingSafeEqual(given, expected)) {
      delete this.data.otps[fullPhone];
      this.save();
      return true;
    }
    record.attempts += 1;
    this.save();
    return false;
  }

  public resetPasswordByPhone(
    countryCode: string,
    phoneNumber: string,
    code: string,
    newPassword: string
  ): PhoneUserRecord {
    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      throw new ValidationError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`);
    }
    const user = this.findByPhone(countryCode, phoneNumber);
    if (!user || !this.consumeOtp(user.fullPhoneNumber, code)) {
      throw new ValidationError('Invalid or expired verification code. Please request a new one.');
    }
    user.passwordHash = hashPassword(newPassword);
    user.passwordChangedAt = new Date().toISOString();
    this.save();
    return user;
  }
}

export function getPhoneAuthStore(): PhoneAuthStore {
  // instanceof check: after a hot reload the global may still hold an instance of the old class.
  if (!(global.__phoneAuthStore instanceof PhoneAuthStore)) {
    global.__phoneAuthStore = new PhoneAuthStore();
  }
  return global.__phoneAuthStore;
}
