import fs from 'fs';
import path from 'path';

const postsDirectory = path.join(process.cwd(), 'src/content/blog');

export interface PostFormInput {
  title: string;
  date: string;
  excerpt: string;
  tags: string;
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

export function toMdxDocument(values: PostFormInput) {
  return `---\ntitle: "${values.title.replace(/"/g, '\\\"')}"\ndate: "${values.date}"\nexcerpt: "${values.excerpt.replace(/"/g, '\\\"')}"\ntags: "${values.tags}"\n---\n\n${values.content.trim()}\n`;
}

export function createPostFile(values: PostFormInput) {
  const slug = slugify(values.title);

  if (!slug) {
    throw new Error('Unable to generate a slug from title.');
  }

  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true });
  }

  const filePath = path.join(postsDirectory, `${slug}.mdx`);

  if (fs.existsSync(filePath)) {
    throw new Error('A post with this title already exists.');
  }

  fs.writeFileSync(filePath, toMdxDocument(values), 'utf8');

  return slug;
}

export function updatePostFile(slug: string, values: PostFormInput) {
  const filePath = path.join(postsDirectory, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    throw new Error('Post not found.');
  }

  fs.writeFileSync(filePath, toMdxDocument(values), 'utf8');
}
