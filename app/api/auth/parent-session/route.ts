import { NextRequest, NextResponse } from 'next/server';
import {
  LOCAL_SESSION_COOKIE,
  createLocalSession,
  encodeSession,
  DEMO_ACCOUNTS,
} from '@/backend/auth/session/local-session';
import { ROLES, PARENT_PIN_COOKIE } from '@/backend/constants/roles';

export async function GET(request: NextRequest) {
  // Demo family user for automatic 1-click parent login
  const familyUser = DEMO_ACCOUNTS['family@selamkids.com'];

  const localSession = createLocalSession({
    id: familyUser.id,
    email: familyUser.email,
    fullName: familyUser.fullName,
    role: ROLES.FAMILY,
  });
  const token = encodeSession(localSession);

  // Target destination: Family Dashboard
  const destination = new URL('/users/families', request.url);
  const response = NextResponse.redirect(destination);

  // Set Family session cookie for seamless authentication without login screen
  response.cookies.set(LOCAL_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  // Set Parent PIN unlocked cookie so the guardian bypasses the PIN lock screen
  response.cookies.set(PARENT_PIN_COOKIE, 'true', {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
