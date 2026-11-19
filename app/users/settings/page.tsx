import { requireAuth } from '@/backend/auth/guards';
import { UserService } from '@/backend/services/user.service';
import { PageHeader } from '@/components/dashboard/page-header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ROLES } from '@/backend/constants/roles';
import { TelegramBotLoginButton } from '@/components/auth/telegram-bot-login-button';
import { getTelegramAccountRepository, unlinkTelegram } from '@/backend/services/telegram-auth.service';
import { getClientIp, getClientUserAgent } from '@/backend/utils/security';

export default async function UserSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ telegram?: string; telegram_error?: string }>;
}) {
  const user = await requireAuth();
  const params = await searchParams;
  const telegramLink = await getTelegramAccountRepository().findByUserId(user.id);
  const telegramOnlyAccount = user.id.startsWith('tg-');

  async function unlinkTelegramAction() {
    'use server';
    const currentUser = await requireAuth();
    const link = await getTelegramAccountRepository().findByUserId(currentUser.id);
    if (link && !currentUser.id.startsWith('tg-')) {
      await unlinkTelegram(
        link.telegram_id,
        { userId: currentUser.id, email: currentUser.email, role: currentUser.role },
        'website',
        { ip: await getClientIp(), userAgent: await getClientUserAgent() }
      );
    }
    redirect('/users/settings?telegram=unlinked');
  }

  if (user.role === ROLES.KID) {
    redirect('/users/kids/profile#settings');
  }

  async function updateProfileNameAction(formData: FormData) {
    'use server';
    const currentUser = await requireAuth();
    const service = new UserService();
    const fullName = formData.get('fullName') as string;

    await service.updateProfile(currentUser, currentUser.id, {
      fullName,
    });

    redirect('/users/settings?updated=true');
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader
        title="Personal Profile & Account Settings"
        description="Manage your account identity, security preferences, and active role."
        breadcrumbs={[
          { label: 'My Portal', href: '/users' },
          { label: 'Settings' },
        ]}
      />

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
          <CardDescription>Update your display name and view account metadata</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updateProfileNameAction} className="space-y-4">
            <Input
              label="Full Name / Display Name"
              name="fullName"
              defaultValue={user.fullName}
              required
            />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Registered Email (Managed via Supabase Auth)
              </label>
              <input
                type="email"
                defaultValue={user.email}
                disabled
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-500 cursor-not-allowed"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <span className="text-xs text-slate-400 block mb-1">Active Role:</span>
                <Badge variant="default">{user.role}</Badge>
              </div>

              <Button type="submit">Update Display Name</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="shadow-sm" id="telegram">
        <CardHeader>
          <CardTitle>Telegram</CardTitle>
          <CardDescription>
            Sign in with one tap and get an alert from our bot every time someone signs in to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {params.telegram === 'linked' && (
            <p className="rounded-xl border border-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
              Telegram connected. Check Telegram for a confirmation from our bot.
            </p>
          )}
          {params.telegram === 'unlinked' && (
            <p className="rounded-xl border border-slate-200 bg-slate-50 dark:bg-white/5 px-3.5 py-2 text-sm font-semibold text-slate-600 dark:text-purple-200">
              Telegram disconnected.
            </p>
          )}
          {params.telegram_error && (
            <p className="rounded-xl border border-rose-300 bg-rose-50 dark:bg-rose-950/40 px-3.5 py-2 text-sm font-semibold text-rose-700 dark:text-rose-300">
              {params.telegram_error}
            </p>
          )}

          {telegramLink ? (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-white">
                  Connected as{' '}
                  {telegramLink.telegram_username
                    ? `@${telegramLink.telegram_username}`
                    : telegramLink.telegram_first_name}
                </p>
                <p className="text-xs text-slate-500 dark:text-purple-300/70">
                  Linked {new Date(telegramLink.linked_at).toLocaleDateString('en-GB')} · Sign-in alerts{' '}
                  {telegramLink.notifications_enabled ? 'on' : 'off'} (send /alerts to the bot to change)
                </p>
              </div>
              {telegramOnlyAccount ? (
                <Badge variant="default">Telegram account</Badge>
              ) : (
                <form action={unlinkTelegramAction}>
                  <Button type="submit" variant="outline" size="sm">
                    Disconnect Telegram
                  </Button>
                </form>
              )}
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-white">Connect Telegram</p>
                <p className="text-xs text-slate-500 dark:text-purple-300/70">
                  Our bot will ask you to confirm in Telegram. We only receive your Telegram name and username.
                </p>
              </div>
              <div className="sm:w-64">
                <TelegramBotLoginButton intent="link" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Appearance & Theme</CardTitle>
          <CardDescription>Choose how Selam Kids looks on your device</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-white">Theme Mode</p>
            <p className="text-xs text-slate-500 dark:text-purple-300/70">
              Toggle between Day Realm (light) and Night Realm (starry dark sky)
            </p>
          </div>
          <ThemeToggle variant="segmented" />
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Security & Password</CardTitle>
          <CardDescription>Reset your password securely</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-800">Change Password</p>
            <p className="text-xs text-slate-500">We will send a reset link to your email</p>
          </div>
          <Link href="/auth/forgot-password">
            <Button variant="outline" size="sm">
              Send Password Reset
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
