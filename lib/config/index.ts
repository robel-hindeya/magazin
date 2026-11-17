export function getAppUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '');
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.replace(/\/$/, '')}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, '')}`;
  }
  return 'http://localhost:3000';
}

export const siteConfig = {
  name: 'Selam Kids',
  description: 'A magical learning adventure inspiring children to write, draw, and read.',
  get url() {
    return getAppUrl();
  },
  links: {
    github: 'https://github.com',
  },
  roles: {
    kid: 'KID',
    family: 'FAMILY',
    teacher: 'TEACHER',
    admin: 'ADMIN',
    superadmin: 'SUPERADMIN',
  },
};
