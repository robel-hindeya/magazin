import type { Metadata, Viewport } from 'next';
import './globals.css';
import { getCurrentUser } from '@/backend/auth/session';
import { Navbar } from '@/components/navigation/navbar';
import { KidService } from '@/backend/services/kid.service';
import { ROLES } from '@/backend/constants/roles';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { PwaRegister } from '@/components/pwa/pwa-register';
import { PageReloadIndicator } from '@/components/ui/page-reload-indicator';

export const dynamic = 'force-dynamic';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#9333ea' },
    { media: '(prefers-color-scheme: dark)', color: '#070314' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'Selam Kids - Creative Learning & Writing Adventure',
  description:
    'Inspiring children aged 6-12+ to build magical animals, write wondrous stories, and level up literacy through gamified quests.',
  applicationName: 'Selam Kids',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Selam Kids',
  },
  formatDetection: {
    telephone: false,
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/images/logo.png',
    apple: '/images/logo.png',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  let initialPoints = 75;
  if (user && (user.role === ROLES.KID || user.role === ROLES.FAMILY)) {
    try {
      const kidService = new KidService();
      const kid = await kidService.getMyProfile(user);
      if (typeof kid?.orbs === 'number') {
        initialPoints = kid.orbs;
      }
    } catch {
      // safe fallback
    }
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  if (localStorage.getItem('selam-kids-theme-mode') === 'dark') {
                    localStorage.removeItem('selam-kids-theme-mode');
                  }
                  var stored = localStorage.getItem('selam-kids-theme-mode-v2');
                  var isDark = stored === 'dark';
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                    document.documentElement.style.colorScheme = 'dark';
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                    document.documentElement.style.colorScheme = 'light';
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-white dark:bg-[#070314] font-sans antialiased text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
        <ThemeProvider>
          <PageReloadIndicator />
          <PwaRegister />
          <Navbar user={user} initialPoints={initialPoints} />
          <main className="flex-1 flex flex-col pb-16 lg:pb-0">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
