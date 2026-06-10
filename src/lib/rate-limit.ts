// In-memory sliding-window rate limiter for the admin login.
//
// Note: serverless instances each hold their own memory and reset on cold
// start, so this throttles a sustained brute-force against a warm instance
// rather than guaranteeing a global limit. Combined with a strong password it
// is sufficient for a single-admin blog. To make it bulletproof, swap the
// Map-backed store below for Upstash Redis behind the same function signatures.

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

const failuresByKey = new Map<string, number[]>();

function recentFailures(key: string, now: number) {
  const timestamps = (failuresByKey.get(key) ?? []).filter((ts) => now - ts < WINDOW_MS);

  if (timestamps.length > 0) {
    failuresByKey.set(key, timestamps);
  } else {
    failuresByKey.delete(key);
  }

  return timestamps;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export function checkLoginRateLimit(key: string): RateLimitResult {
  const now = Date.now();
  const timestamps = recentFailures(key, now);

  if (timestamps.length >= MAX_ATTEMPTS) {
    const retryAfterSeconds = Math.ceil((WINDOW_MS - (now - timestamps[0])) / 1000);
    return { allowed: false, remaining: 0, retryAfterSeconds };
  }

  return { allowed: true, remaining: MAX_ATTEMPTS - timestamps.length, retryAfterSeconds: 0 };
}

export function recordLoginFailure(key: string): void {
  const now = Date.now();
  const timestamps = recentFailures(key, now);
  timestamps.push(now);
  failuresByKey.set(key, timestamps);
}

export function clearLoginAttempts(key: string): void {
  failuresByKey.delete(key);
}
