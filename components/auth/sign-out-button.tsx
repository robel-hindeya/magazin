'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Loader2 } from 'lucide-react';
import { Button, ButtonProps } from '@/components/ui/button';

export interface SignOutButtonProps extends Omit<ButtonProps, 'onClick'> {
  showIcon?: boolean;
  label?: string;
  redirectTo?: string;
}

export function SignOutButton({
  showIcon = true,
  label = 'Sign Out',
  redirectTo = '/auth/login',
  variant = 'destructive',
  size = 'default',
  className,
  ...props
}: SignOutButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleSignOut}
      disabled={isLoading}
      className={className}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
      ) : showIcon ? (
        <LogOut className="h-4 w-4 mr-2" />
      ) : null}
      <span>{isLoading ? 'Signing Out...' : label}</span>
    </Button>
  );
}
