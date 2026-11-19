import { AuditLogRepository } from '@/backend/db/repositories/audit-log.repository';
import {
  TelegramAccountRecord,
  TelegramAccountRepository,
} from '@/backend/db/repositories/telegram-account.repository';
import { ROLES, UserRole } from '@/backend/constants/roles';
import { AUDIT_ACTION } from '@/backend/constants/status';
import {
  TelegramIdentity,
  escapeTelegramHtml,
  sendLoginAlert,
  sendTelegramMessage,
  siteButton,
} from '@/backend/auth/telegram';

export interface RequestMeta {
  ip: string;
  userAgent: string;
}

export interface SessionUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
}

const repo = new TelegramAccountRepository();
const audit = new AuditLogRepository();

function telegramDisplayName(tg: TelegramIdentity): string {
  return [tg.first_name, tg.last_name].filter(Boolean).join(' ').trim() || tg.username || 'Telegram user';
}

function telegramProfileFields(tg: TelegramIdentity) {
  return {
    telegram_username: tg.username ?? null,
    telegram_first_name: tg.first_name ?? null,
    telegram_last_name: tg.last_name ?? null,
    telegram_photo_url: tg.photo_url ?? null,
    // For private chats with the bot, chat id equals the Telegram user id.
    chat_id: tg.id,
  };
}

/**
 * Signs in with a verified Telegram identity.
 * Linked Telegram -> that account. Unlinked -> a new FAMILY (parent) account is created,
 * keyed by the Telegram id so the same Telegram can never create two accounts.
 */
export async function signInWithTelegram(
  tg: TelegramIdentity,
  meta: RequestMeta
): Promise<{ user: SessionUser; isNew: boolean }> {
  const now = new Date().toISOString();
  let link = await repo.findByTelegramId(tg.id);
  let isNew = false;

  if (!link) {
    const record: TelegramAccountRecord = {
      telegram_id: tg.id,
      user_id: `tg-${tg.id}`,
      user_email: `tg${tg.id}@telegram.selamkids.com`,
      user_full_name: telegramDisplayName(tg),
      user_role: ROLES.FAMILY,
      ...telegramProfileFields(tg),
      notifications_enabled: true,
      linked_at: now,
      last_login_at: now,
      updated_at: now,
    };
    link = await repo.create(record);
    isNew = true;

    await audit.createLog({
      user_id: link.user_id,
      user_email: link.user_email,
      user_role: link.user_role,
      action: AUDIT_ACTION.CREATE,
      resource: 'users',
      details: { method: 'telegram', telegram_id: tg.id, telegram_username: tg.username ?? null },
      ip_address: meta.ip,
      user_agent: meta.userAgent,
    });
  } else {
    await repo.update(tg.id, { ...telegramProfileFields(tg), last_login_at: now });
  }

  const user: SessionUser = {
    id: link.user_id,
    email: link.user_email,
    fullName: link.user_full_name,
    role: link.user_role,
  };

  await audit.createLog({
    user_id: user.id,
    user_email: user.email,
    user_role: user.role,
    action: AUDIT_ACTION.LOGIN,
    resource: 'auth',
    details: { method: 'telegram', telegram_id: tg.id, new_account: isNew },
    ip_address: meta.ip,
    user_agent: meta.userAgent,
  });

  return { user, isNew };
}

/** Bot messages that follow a Telegram sign-in. Runs after the response is sent. */
export async function notifyTelegramSignIn(
  tg: TelegramIdentity,
  user: SessionUser,
  isNew: boolean,
  meta: RequestMeta
): Promise<void> {
  if (isNew) {
    await sendTelegramMessage(
      tg.id,
      [
        `👋 <b>Welcome to Selam Kids, ${escapeTelegramHtml(tg.first_name)}!</b>`,
        '',
        'Your parent account was created with Telegram. You can now sign in with one tap, and I will message you here whenever someone signs in.',
        '',
        'Send /help to see what I can do.',
      ].join('\n'),
      siteButton('Open Selam Kids', '/users')
    );
    return;
  }
  const link = await repo.findByTelegramId(tg.id);
  if (link?.notifications_enabled) {
    await sendLoginAlert(tg.id, { fullName: user.fullName, method: 'Telegram', ...meta });
  }
}

/** Links a verified Telegram identity to the signed-in account. Throws a user-safe message on conflict. */
export async function linkTelegramToUser(
  tg: TelegramIdentity,
  user: SessionUser,
  meta: RequestMeta
): Promise<void> {
  if (user.role === ROLES.KID) {
    throw new Error('Kid accounts cannot connect Telegram. Ask a parent to connect it from their account.');
  }

  const existingForTelegram = await repo.findByTelegramId(tg.id);
  if (existingForTelegram) {
    if (existingForTelegram.user_id === user.id) return; // already linked to this account
    throw new Error('This Telegram account is already connected to another Selam Kids account.');
  }

  const existingForUser = await repo.findByUserId(user.id);
  if (existingForUser) {
    throw new Error('Your account already has a Telegram account connected. Disconnect it first.');
  }

  const now = new Date().toISOString();
  await repo.create({
    telegram_id: tg.id,
    user_id: user.id,
    user_email: user.email,
    user_full_name: user.fullName,
    user_role: user.role,
    ...telegramProfileFields(tg),
    notifications_enabled: true,
    linked_at: now,
    last_login_at: null,
    updated_at: now,
  });

  await audit.createLog({
    user_id: user.id,
    user_email: user.email,
    user_role: user.role,
    action: AUDIT_ACTION.SETTINGS_CHANGED,
    resource: 'telegram_accounts',
    resource_id: String(tg.id),
    details: { change: 'telegram_linked', telegram_username: tg.username ?? null },
    ip_address: meta.ip,
    user_agent: meta.userAgent,
  });
}

export async function notifyTelegramLinked(tg: TelegramIdentity, user: SessionUser): Promise<void> {
  await sendTelegramMessage(
    tg.id,
    [
      '✅ <b>Telegram connected</b>',
      '',
      `This Telegram is now linked to <b>${escapeTelegramHtml(user.fullName)}</b> on Selam Kids.`,
      'You can sign in with Telegram, and I will alert you about every new sign-in.',
      '',
      'Send /unlink at any time to disconnect.',
    ].join('\n')
  );
}

export async function unlinkTelegram(
  telegramId: number,
  actor: { userId: string; email: string; role: string },
  via: 'website' | 'bot',
  meta?: Partial<RequestMeta>
): Promise<void> {
  await repo.deleteByTelegramId(telegramId);
  await audit.createLog({
    user_id: actor.userId,
    user_email: actor.email,
    user_role: actor.role,
    action: AUDIT_ACTION.SETTINGS_CHANGED,
    resource: 'telegram_accounts',
    resource_id: String(telegramId),
    details: { change: 'telegram_unlinked', via },
    ip_address: meta?.ip ?? null,
    user_agent: meta?.userAgent ?? null,
  });
}

/** Sends a sign-in alert for non-Telegram logins (e.g. phone) if the account has Telegram linked. */
export async function alertLinkedTelegram(
  user: { id: string; fullName: string },
  method: string,
  meta: RequestMeta
): Promise<void> {
  const link = await repo.findByUserId(user.id);
  if (link?.chat_id && link.notifications_enabled) {
    await sendLoginAlert(link.chat_id, { fullName: user.fullName, method, ...meta });
  }
}

export function getTelegramAccountRepository() {
  return repo;
}
