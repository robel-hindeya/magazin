import * as React from 'react';
import { Breadcrumb, BreadcrumbItem } from '@/components/navigation/breadcrumb';

export interface PageHeaderProps {
  title: React.ReactNode;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, breadcrumbs, actions }: PageHeaderProps) {
  return (
    <div className="mb-4 sm:mb-6 lg:mb-8">
      {breadcrumbs && <Breadcrumb items={breadcrumbs} />}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            {title}
          </h1>
          {description && <p className="mt-1 text-xs sm:text-sm md:text-base text-slate-600 dark:text-purple-200/80 font-medium">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 sm:gap-3 shrink-0">{actions}</div>}
      </div>
    </div>
  );
}
