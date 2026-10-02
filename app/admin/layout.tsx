import { redirect } from 'next/navigation';
import { requireAdmin } from '@/backend/auth/guards';
import { Sidebar, SidebarItem } from '@/components/navigation/sidebar';
import {
  LayoutDashboard,
  Users,
  Compass,
  Heart,
  GraduationCap,
  BookOpen,
  BarChart3,
  ScrollText,
  Settings,
} from 'lucide-react';

import { UnauthorizedError } from '@/backend/errors/auth-error';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await requireAdmin();
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      redirect('/auth/login?redirectTo=/admin');
    }
    redirect('/users');
  }

  const navItems: SidebarItem[] = [
    { label: 'Overview', href: '/admin', icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: 'All Users', href: '/admin/users', icon: <Users className="h-4 w-4" /> },
    { label: 'Kid Explorers', href: '/admin/kids', icon: <Compass className="h-4 w-4" /> },
    { label: 'Family Units', href: '/admin/families', icon: <Heart className="h-4 w-4" /> },
    { label: 'Educators', href: '/admin/teachers', icon: <GraduationCap className="h-4 w-4" /> },
    { label: 'Content & Prompts', href: '/admin/content', icon: <BookOpen className="h-4 w-4" /> },
    { label: 'Reports & Safety', href: '/admin/reports', icon: <BarChart3 className="h-4 w-4" /> },
    { label: 'Audit Logs', href: '/admin/audit-logs', icon: <ScrollText className="h-4 w-4" /> },
    { label: 'Admin Settings', href: '/admin/settings', icon: <Settings className="h-4 w-4" /> },
  ];

  return (
    <div className="flex-1 flex flex-col md:flex-row">
      <Sidebar
        title="Admin Console"
        subtitle="Operations & Moderation"
        items={navItems}
      />
      <div className="flex-1 p-6 md:p-8 bg-slate-50/70 dark:bg-[#070314]/90 overflow-y-auto transition-colors">{children}</div>
    </div>
  );
}
