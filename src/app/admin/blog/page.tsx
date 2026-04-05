import Link from 'next/link';
import { redirect } from 'next/navigation';
import { clearAdminSession, requireAdminAuth } from '@/lib/admin-auth';
import { createPostFile, type PostFormInput } from '@/lib/blog-admin';
import { getSortedPostsData } from '@/lib/blog';

export default async function AdminBlogPage() {
  await requireAdminAuth();

  const posts = getSortedPostsData();

  async function createPost(formData: FormData) {
    'use server';

    await requireAdminAuth();

    const payload: PostFormInput = {
      title: String(formData.get('title') ?? ''),
      date: String(formData.get('date') ?? ''),
      excerpt: String(formData.get('excerpt') ?? ''),
      tags: String(formData.get('tags') ?? ''),
      content: String(formData.get('content') ?? ''),
    };

    if (!payload.title || !payload.date || !payload.content) {
      redirect('/admin/blog?error=missing');
    }

    try {
      createPostFile(payload);
    } catch {
      redirect('/admin/blog?error=exists');
    }

    redirect('/admin/blog?created=1');
  }

  async function logout() {
    'use server';

    await clearAdminSession();
    redirect('/admin/login');
  }

  return (
    <main className="bg-[#000000] min-h-screen text-white px-4 py-8 md:px-10 lg:px-24">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Blog admin</h1>
            <p className="text-[#a0a0a5] text-sm mt-1">Create and edit blog posts.</p>
          </div>

          <form action={logout}>
            <button type="submit" className="rounded-md border border-[#2C2C2E] px-4 py-2 text-sm hover:border-[#95bdc9]">
              Sign out
            </button>
          </form>
        </header>

        <section className="rounded-2xl border border-[#2C2C2E] bg-[#1C1C1E] p-6">
          <h2 className="text-xl font-semibold mb-4">Create post</h2>

          <form action={createPost} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="space-y-1">
              <span className="text-sm text-[#a0a0a5]">Title</span>
              <input name="title" required className="w-full rounded-md bg-black border border-[#2C2C2E] px-3 py-2" />
            </label>

            <label className="space-y-1">
              <span className="text-sm text-[#a0a0a5]">Date</span>
              <input name="date" type="date" required className="w-full rounded-md bg-black border border-[#2C2C2E] px-3 py-2" />
            </label>

            <label className="space-y-1 md:col-span-2">
              <span className="text-sm text-[#a0a0a5]">Excerpt</span>
              <input name="excerpt" className="w-full rounded-md bg-black border border-[#2C2C2E] px-3 py-2" />
            </label>

            <label className="space-y-1 md:col-span-2">
              <span className="text-sm text-[#a0a0a5]">Tags (comma-separated)</span>
              <input name="tags" className="w-full rounded-md bg-black border border-[#2C2C2E] px-3 py-2" />
            </label>

            <label className="space-y-1 md:col-span-2">
              <span className="text-sm text-[#a0a0a5]">Content (Markdown)</span>
              <textarea
                name="content"
                rows={12}
                required
                className="w-full rounded-md bg-black border border-[#2C2C2E] px-3 py-2 font-mono text-sm"
                placeholder={'## Heading\n\nParagraph text\n\n```embed\nhttps://example.com/widget\n```'}
              />
            </label>

            <div className="md:col-span-2">
              <button type="submit" className="rounded-md bg-[#95bdc9] text-black font-semibold px-4 py-2 hover:opacity-90">
                Save post
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-2xl border border-[#2C2C2E] bg-[#1C1C1E] p-6">
          <h2 className="text-xl font-semibold mb-4">Existing posts</h2>

          <ul className="space-y-3">
            {posts.map((post) => (
              <li key={post.slug} className="flex flex-wrap items-center justify-between gap-3 border border-[#2C2C2E] rounded-md p-3">
                <div>
                  <p className="font-medium">{post.title}</p>
                  <p className="text-xs text-[#a0a0a5]">/{post.slug}</p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="rounded-md border border-[#2C2C2E] px-3 py-1 text-sm hover:border-[#95bdc9]"
                  >
                    View
                  </Link>
                  <Link
                    href={`/admin/blog/${post.slug}`}
                    className="rounded-md border border-[#2C2C2E] px-3 py-1 text-sm hover:border-[#95bdc9]"
                  >
                    Edit
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
