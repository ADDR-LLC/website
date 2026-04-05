import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const ADMIN_COOKIE_NAME = 'blog_admin_session';

function getConfiguredPassword() {
  const configured = process.env.BLOG_ADMIN_PASSWORD;

  if (!configured) {
    throw new Error('Missing BLOG_ADMIN_PASSWORD environment variable.');
  }

  return configured;
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!session) {
    return false;
  }

  return session === getConfiguredPassword();
}

export async function requireAdminAuth() {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    redirect('/admin/login');
  }
}

export async function createAdminSession(password: string) {
  const configuredPassword = getConfiguredPassword();

  if (password !== configuredPassword) {
    return false;
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, configuredPassword, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8,
  });

  return true;
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}
