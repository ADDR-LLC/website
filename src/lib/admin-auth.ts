import crypto from 'crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const ADMIN_COOKIE_NAME = 'blog_admin_session';
const SESSION_TTL_SECONDS = 60 * 60 * 8;

function getConfiguredPassword() {
  const configured = process.env.BLOG_ADMIN_PASSWORD;

  if (!configured) {
    return null;
  }

  return configured;
}

function getSessionSecret() {
  const secret = process.env.BLOG_ADMIN_SESSION_SECRET ?? process.env.BLOG_ADMIN_PASSWORD;

  if (!secret) {
    return null;
  }

  return secret;
}

function signPayload(payload: string) {
  const secret = getSessionSecret();

  if (!secret) {
    return null;
  }

  return crypto.createHmac('sha256', secret).update(payload).digest('base64url');
}

function createSessionToken() {
  const expiresAt = Date.now() + SESSION_TTL_SECONDS * 1000;
  const payload = `admin:${expiresAt}`;
  const signature = signPayload(payload);
  if (!signature) {
    return null;
  }
  return `${payload}.${signature}`;
}

function validateSessionToken(token: string) {
  const [payload, signature] = token.split('.');

  if (!payload || !signature) {
    return false;
  }

  const expected = signPayload(payload);
  if (!expected) {
    return false;
  }
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (signatureBuffer.length !== expectedBuffer.length) {
    return false;
  }

  if (!crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) {
    return false;
  }

  const [scope, expiresAtRaw] = payload.split(':');

  if (scope !== 'admin') {
    return false;
  }

  const expiresAt = Number(expiresAtRaw);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) {
    return false;
  }

  return true;
}

export async function isAdminAuthenticated() {
  if (!getConfiguredPassword()) {
    return false;
  }

  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!session) {
    return false;
  }

  return validateSessionToken(session);
}

export async function requireAdminAuth() {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    redirect('/admin/login');
  }
}

export async function createAdminSession(password: string) {
  const configuredPassword = getConfiguredPassword();

  if (!configuredPassword || password !== configuredPassword) {
    return false;
  }

  const sessionToken = createSessionToken();
  if (!sessionToken) {
    return false;
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  });

  return true;
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}
