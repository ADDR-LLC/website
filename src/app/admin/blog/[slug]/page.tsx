import { getPostData } from '@/lib/blog';
import { requireAdminAuth } from '@/lib/admin-auth';
import { deletePostFile, updatePostFile, type PostFormInput } from '@/lib/blog-admin';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';

const AVAILABLE_PYTHON_PACKAGES = ['numpy', 'matplotlib', 'pandas', 'scipy'];

export default async function EditPostPage({ params }: { params: Promise<{ slug: string }> }) {
  await requireAdminAuth();

  const { slug } = await params;
  const post = getPostData(slug);

  if (!post) {
    notFound();
  }

  async function updatePost(formData: FormData) {
    'use server';

    await requireAdminAuth();

    const payload: PostFormInput = {
      title: String(formData.get('title') ?? ''),
      date: String(formData.get('date') ?? ''),
      excerpt: String(formData.get('excerpt') ?? ''),
      tags: String(formData.get('tags') ?? ''),
      pythonPackages: Array.from(
        new Set([
          ...formData
            .getAll('pythonPackages')
            .map((pkg) => String(pkg).trim())
            .filter(Boolean),
          ...String(formData.get('pythonPackagesExtra') ?? '')
            .split(',')
            .map((pkg) => pkg.trim())
            .filter(Boolean),
        ]),
      ).join(', '),
      content: String(formData.get('content') ?? ''),
    };

    if (!payload.title || !payload.content) {
      redirect(`/admin/blog/${slug}?error=missing`);
    }

    updatePostFile(slug, payload);
    redirect(`/admin/blog/${slug}?saved=1`);
  }

  async function deletePost() {
    'use server';

    await requireAdminAuth();
    deletePostFile(slug);
    redirect('/admin/blog?deleted=1');
  }

  const customPythonPackages = (post.pythonPackages ?? []).filter((pkg) => !AVAILABLE_PYTHON_PACKAGES.includes(pkg));

  return (
    <main className="bg-[#000000] min-h-screen text-white px-4 py-8 md:px-10 lg:px-24">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Edit post</h1>
          <Link href="/admin/blog" className="text-sm text-[#95bdc9] hover:text-white">
            ← Back to admin
          </Link>
        </div>

        <form action={updatePost} className="rounded-2xl border border-[#2C2C2E] bg-[#1C1C1E] p-6 space-y-4">
          <label className="space-y-1 block">
            <span className="text-sm text-[#a0a0a5]">Title</span>
            <input name="title" defaultValue={post.title} required className="w-full rounded-md bg-black border border-[#2C2C2E] px-3 py-2" />
          </label>

          <label className="space-y-1 block">
            <span className="text-sm text-[#a0a0a5]">Date & time (optional)</span>
            <input
              name="date"
              type="datetime-local"
              defaultValue={post.date.slice(0, 16)}
              className="w-full rounded-md bg-black border border-[#2C2C2E] px-3 py-2"
            />
            <p className="text-xs text-[#7f7f82]">Leave empty to auto-use the current date/time at save.</p>
          </label>

          <label className="space-y-1 block">
            <span className="text-sm text-[#a0a0a5]">Excerpt</span>
            <input name="excerpt" defaultValue={post.excerpt} className="w-full rounded-md bg-black border border-[#2C2C2E] px-3 py-2" />
          </label>

          <label className="space-y-1 block">
            <span className="text-sm text-[#a0a0a5]">Tags (comma-separated)</span>
            <input name="tags" defaultValue={post.tags?.join(', ')} className="w-full rounded-md bg-black border border-[#2C2C2E] px-3 py-2" />
          </label>

          <fieldset className="space-y-2">
            <legend className="text-sm text-[#a0a0a5]">Python libraries for this post</legend>
            <div className="flex flex-wrap gap-4">
              {AVAILABLE_PYTHON_PACKAGES.map((pkg) => (
                <label key={pkg} className="inline-flex items-center gap-2 text-sm text-[#d7d7d7]">
                  <input
                    type="checkbox"
                    name="pythonPackages"
                    value={pkg}
                    defaultChecked={post.pythonPackages?.includes(pkg)}
                    className="accent-[#95bdc9]"
                  />
                  {pkg}
                </label>
              ))}
            </div>
          </fieldset>

          <label className="space-y-1 block">
            <span className="text-sm text-[#a0a0a5]">Additional Python libraries (optional, comma-separated)</span>
            <input
              name="pythonPackagesExtra"
              defaultValue={customPythonPackages.join(', ')}
              placeholder="seaborn, sympy"
              className="w-full rounded-md bg-black border border-[#2C2C2E] px-3 py-2"
            />
          </label>

          <label className="space-y-1 block">
            <span className="text-sm text-[#a0a0a5]">Content (Markdown)</span>
            <textarea
              name="content"
              rows={14}
              defaultValue={post.content}
              required
              className="w-full rounded-md bg-black border border-[#2C2C2E] px-3 py-2 font-mono text-sm"
            />
          </label>

          <div className="flex flex-wrap items-center gap-3">
            <button type="submit" className="rounded-md bg-[#95bdc9] text-black font-semibold px-4 py-2 hover:opacity-90">
              Save changes
            </button>
          </div>
        </form>

        <form action={deletePost} className="rounded-2xl border border-red-900/60 bg-red-950/20 p-4">
          <p className="text-sm text-red-300 mb-3">Danger zone: permanently delete this post.</p>
          <button type="submit" className="rounded-md border border-red-800/80 px-4 py-2 text-red-300 hover:border-red-500">
            Delete post
          </button>
        </form>
      </div>
    </main>
  );
}
