import { createAdminSession, isAdminAuthenticated } from '@/lib/admin-auth';
import { checkLoginRateLimit, clearLoginAttempts, recordLoginFailure } from '@/lib/rate-limit';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

// Auth + rate-limit checks read per-request data — never prerender this.
export const dynamic = 'force-dynamic';

function getClientKey(headerList: Headers) {
  const forwarded = headerList.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  return headerList.get('x-real-ip') ?? 'unknown';
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isAdminAuthenticated()) {
    redirect('/admin/blog');
  }

  const { error } = await searchParams;

  async function login(formData: FormData) {
    'use server';

    const clientKey = getClientKey(await headers());

    if (!checkLoginRateLimit(clientKey).allowed) {
      redirect('/admin/login?error=rate');
    }

    const password = String(formData.get('password') ?? '');
    const ok = await createAdminSession(password);

    if (!ok) {
      recordLoginFailure(clientKey);
      redirect('/admin/login?error=invalid');
    }

    clearLoginAttempts(clientKey);
    redirect('/admin/blog');
  }

  return (
    <main className="bg-[#000000] min-h-screen text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-[#2C2C2E] bg-[#1C1C1E] p-8">
        <h1 className="text-2xl font-semibold mb-2">Admin login</h1>
        <p className="text-[#a0a0a5] text-sm mb-6">Enter your admin password to manage blog posts.</p>

        {error === 'invalid' ? (
          <p className="text-red-300 text-sm mb-4">Invalid password. Please try again.</p>
        ) : null}

        {error === 'rate' ? (
          <p className="text-red-300 text-sm mb-4">Too many failed attempts. Please wait a few minutes and try again.</p>
        ) : null}

        <form action={login} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm text-[#a0a0a5]">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-md bg-[#000000] border border-[#2C2C2E] px-3 py-2 outline-none focus:border-[#95bdc9]"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-[#95bdc9] text-black font-semibold px-4 py-2 hover:opacity-90 transition-opacity"
          >
            Sign in
          </button>
        </form>
      </div>
    </main>
  );
}
