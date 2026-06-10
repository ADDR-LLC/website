import matter from 'gray-matter';
import { get, list } from '@vercel/blob';
import { unstable_cache } from 'next/cache';

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  tags?: string[];
  pythonPackages?: string[];
}

// Posts live in Vercel Blob under this prefix as `<prefix><slug>.mdx`.
export const BLOG_BLOB_PREFIX = 'blog/';
// Tag used to invalidate the cached post list after a create/update/delete.
export const BLOG_CACHE_TAG = 'blog-posts';

function parseStringArray(value: unknown): string[] {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

async function readAllPosts(): Promise<BlogPost[]> {
  let blobs: { pathname: string; url: string }[];

  try {
    const result = await list({ prefix: BLOG_BLOB_PREFIX });
    blobs = result.blobs;
  } catch (error) {
    // Missing/unconfigured Blob store (e.g. BLOB_READ_WRITE_TOKEN not set yet).
    // Mirror the previous "no posts" behaviour instead of crashing the page.
    console.error('Failed to list blog posts from Vercel Blob:', error);
    return [];
  }

  const posts = await Promise.all(
    blobs
      .filter((blob) => blob.pathname.endsWith('.mdx') || blob.pathname.endsWith('.md'))
      .map(async (blob): Promise<BlogPost | null> => {
        // Private store: read content with the token via get(), not the public URL.
        const result = await get(blob.pathname, { access: 'private' });
        if (!result || result.statusCode !== 200) {
          return null;
        }

        const fileContents = await new Response(result.stream).text();
        const { data, content } = matter(fileContents);

        const slug = blob.pathname.slice(BLOG_BLOB_PREFIX.length).replace(/\.mdx?$/, '');

        return {
          slug,
          title: data.title || 'Untitled',
          date: data.date || '2024-01-01',
          excerpt: data.excerpt || '',
          tags: parseStringArray(data.tags),
          pythonPackages: parseStringArray(data.pythonPackages),
          content,
        };
      }),
  );

  return posts
    .filter((post): post is BlogPost => post !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

// Cache the parsed post list so reader-facing pages stay static and only hit
// Blob at build / on-demand revalidation. Mutations call
// revalidateTag(BLOG_CACHE_TAG, 'max') to refresh this entry.
const getCachedPosts = unstable_cache(readAllPosts, ['blog-posts-list'], {
  tags: [BLOG_CACHE_TAG],
});

// Cached reads — use these on public, reader-facing pages.
export async function getSortedPostsData(): Promise<BlogPost[]> {
  return getCachedPosts();
}

export async function getPostData(slug: string): Promise<BlogPost | undefined> {
  const posts = await getSortedPostsData();
  return posts.find((post) => post.slug === slug);
}

// Uncached reads — use these in the admin so an editor always sees their own
// writes immediately (the cached reads above are stale-while-revalidate).
export async function getAllPostsUncached(): Promise<BlogPost[]> {
  return readAllPosts();
}

export async function getPostUncached(slug: string): Promise<BlogPost | undefined> {
  const posts = await readAllPosts();
  return posts.find((post) => post.slug === slug);
}
