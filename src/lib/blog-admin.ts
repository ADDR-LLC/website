import { put, del, list } from '@vercel/blob';
import { BLOG_BLOB_PREFIX } from './blog';

export interface PostFormInput {
  title: string;
  date: string;
  timezone?: string;
  excerpt: string;
  tags: string;
  pythonPackages: string;
  content: string;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function blobPath(slug: string) {
  return `${BLOG_BLOB_PREFIX}${slug}.mdx`;
}

function formatNowInTimeZone(timeZone: string) {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('sv-SE', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(now);
  const map = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return `${map.year}-${map.month}-${map.day}T${map.hour}:${map.minute}`;
}

function resolveDate(dateInput: string, timezone?: string) {
  const trimmed = dateInput.trim();
  if (trimmed) {
    return trimmed;
  }

  const tz = timezone?.trim() || 'America/New_York';

  try {
    return formatNowInTimeZone(tz);
  } catch {
    return formatNowInTimeZone('America/New_York');
  }
}

export function toMdxDocument(values: PostFormInput) {
  const date = resolveDate(values.date, values.timezone);

  return `---\ntitle: "${values.title.replace(/"/g, '\\\"')}"\ndate: "${date}"\nexcerpt: "${values.excerpt.replace(/"/g, '\\\"')}"\ntags: "${values.tags}"\npythonPackages: "${values.pythonPackages}"\n---\n\n${values.content.trim()}\n`;
}

async function postExists(slug: string) {
  const path = blobPath(slug);
  const { blobs } = await list({ prefix: path });
  return blobs.some((blob) => blob.pathname === path);
}

const PUT_OPTIONS = {
  access: 'private',
  contentType: 'text/markdown; charset=utf-8',
  addRandomSuffix: false,
} as const;

export async function createPostFile(values: PostFormInput) {
  const slug = slugify(values.title);

  if (!slug) {
    throw new Error('Unable to generate a slug from title.');
  }

  if (await postExists(slug)) {
    throw new Error('A post with this title already exists.');
  }

  await put(blobPath(slug), toMdxDocument(values), {
    ...PUT_OPTIONS,
    allowOverwrite: false,
  });

  return slug;
}

export async function updatePostFile(slug: string, values: PostFormInput) {
  if (!(await postExists(slug))) {
    throw new Error('Post not found.');
  }

  await put(blobPath(slug), toMdxDocument(values), {
    ...PUT_OPTIONS,
    allowOverwrite: true,
  });
}

export async function deletePostFile(slug: string) {
  if (!(await postExists(slug))) {
    throw new Error('Post not found.');
  }

  await del(blobPath(slug));
}
