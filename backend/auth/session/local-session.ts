import { ROLES, UserRole } from '@/backend/constants/roles';
import { Permission, ROLE_DEFAULT_PERMISSIONS } from '@/backend/constants/permissions';

export const LOCAL_SESSION_COOKIE = 'selam_local_session';

export interface LocalSessionPayload {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  permissions: Permission[];
  createdAt: number;
}

export const DEMO_ACCOUNTS: Record<string, { id: string; email: string; fullName: string; role: UserRole }> = {
  'kid@selamkids.com': {
    id: '11111111-aaaa-bbbb-cccc-111111111111',
    email: 'kid@selamkids.com',
    fullName: 'Leo Starlight',
    role: ROLES.KID,
  },
  'family@selamkids.com': {
    id: '22222222-aaaa-bbbb-cccc-222222222222',
    email: 'family@selamkids.com',
    fullName: 'The Vance Family',
    role: ROLES.FAMILY,
  },
  'teacher@selamkids.com': {
    id: '33333333-aaaa-bbbb-cccc-333333333333',
    email: 'teacher@selamkids.com',
    fullName: 'Ms. Clara Woods',
    role: ROLES.TEACHER,
  },
  'admin@selamkids.com': {
    id: '44444444-aaaa-bbbb-cccc-444444444444',
    email: 'admin@selamkids.com',
    fullName: 'Marcus Stone (Admin)',
    role: ROLES.ADMIN,
  },
  'superadmin@selamkids.com': {
    id: '55555555-aaaa-bbbb-cccc-555555555555',
    email: 'superadmin@selamkids.com',
    fullName: 'Grand Archon (Superadmin)',
    role: ROLES.SUPERADMIN,
  },
};

export function createLocalSession(user: {
  id?: string;
  email: string;
  fullName?: string;
  role?: UserRole;
}): LocalSessionPayload {
  const role = user.role || ROLES.KID;
  const permissions = ROLE_DEFAULT_PERMISSIONS[role] || [];
  const id = user.id || `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  return {
    id,
    email: user.email.toLowerCase().trim(),
    fullName: user.fullName || user.email.split('@')[0] || 'Young Author',
    role,
    permissions,
    createdAt: Date.now(),
  };
}

/* -------------------------------------------------------------------------- */
/* Signed session tokens                                                       */
/* Format: base64url(JSON payload) + "." + base64url(HMAC-SHA256 signature).   */
/* Uses Web Crypto so the same code runs in Edge middleware and Node routes.  */
/* -------------------------------------------------------------------------- */

export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

const encoder = new TextEncoder();
let cachedKey: { secret: string; key: CryptoKey } | null = null;

function getSessionSecret(): string | null {
  if (process.env.SESSION_SECRET && process.env.SESSION_SECRET.length >= 32) {
    return process.env.SESSION_SECRET;
  }
  // Fallback: derive from the Supabase service role key, which is already a server-only secret.
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (serviceKey && !serviceKey.includes('dummy')) {
    return `selam-session:${serviceKey}`;
  }
  if (process.env.NODE_ENV !== 'production') {
    return 'selam-kids-insecure-development-session-secret';
  }
  return null;
}

async function getSigningKey(): Promise<CryptoKey | null> {
  const secret = getSessionSecret();
  if (!secret) return null;
  if (cachedKey && cachedKey.secret === secret) return cachedKey.key;
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
  cachedKey = { secret, key };
  return key;
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(value: string): Uint8Array<ArrayBuffer> {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/** Signs a session payload. Throws if no signing secret is configured in production. */
export async function encodeSession(payload: LocalSessionPayload): Promise<string> {
  const key = await getSigningKey();
  if (!key) {
    throw new Error('SESSION_SECRET is not configured. Set it in the environment to enable sign-in.');
  }
  const body = toBase64Url(encoder.encode(JSON.stringify(payload)));
  const signature = new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(body)));
  return `${body}.${toBase64Url(signature)}`;
}

/** Verifies signature and age. Returns null for forged, legacy (unsigned) or expired tokens. */
export async function decodeSession(token: string): Promise<LocalSessionPayload | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 2 || !parts[0] || !parts[1]) return null;
    const [body, signature] = parts;

    const key = await getSigningKey();
    if (!key) return null;

    const valid = await crypto.subtle.verify('HMAC', key, fromBase64Url(signature), encoder.encode(body));
    if (!valid) return null;

    const parsed = JSON.parse(new TextDecoder().decode(fromBase64Url(body))) as LocalSessionPayload;
    if (!parsed || !parsed.id || !parsed.role || !parsed.email || !parsed.createdAt) return null;
    if (Date.now() - parsed.createdAt > SESSION_MAX_AGE_SECONDS * 1000) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Cookie options shared by every route that issues a session. */
export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: SESSION_MAX_AGE_SECONDS,
};
