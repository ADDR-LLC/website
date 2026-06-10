// One-time migration: upload existing local .mdx posts into Vercel Blob.
//
// Usage (requires BLOB_READ_WRITE_TOKEN in .env.local):
//   node --env-file=.env.local scripts/seed-blob.mjs
//
// Safe to re-run: existing posts are overwritten with the local copy.

import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { put } from '@vercel/blob';

const CONTENT_DIR = path.join(process.cwd(), 'src/content/blog');
const BLOG_BLOB_PREFIX = 'blog/';

const files = (await readdir(CONTENT_DIR)).filter(
  (file) => file.endsWith('.mdx') || file.endsWith('.md'),
);

if (files.length === 0) {
  console.log('No local .mdx/.md posts found to seed.');
  process.exit(0);
}

for (const file of files) {
  const body = await readFile(path.join(CONTENT_DIR, file), 'utf8');
  const result = await put(`${BLOG_BLOB_PREFIX}${file}`, body, {
    access: 'private',
    contentType: 'text/markdown; charset=utf-8',
    addRandomSuffix: false,
    allowOverwrite: true,
  });
  console.log(`Seeded ${file} -> ${result.url}`);
}

console.log(`Done. Uploaded ${files.length} post(s).`);
