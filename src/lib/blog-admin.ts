import fs from 'fs';
import path from 'path';

const postsDirectory = path.join(process.cwd(), 'src/content/blog');

export interface PostFormInput {
  title: string;
  date: string;
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

function resolveDate(dateInput: string) {
  const trimmed = dateInput.trim();
  if (trimmed) {
    return trimmed;
  }

  return new Date().toISOString().slice(0, 16);
}

export function toMdxDocument(values: PostFormInput) {
  const date = resolveDate(values.date);

  return `---\ntitle: "${values.title.replace(/"/g, '\\\"')}"\ndate: "${date}"\nexcerpt: "${values.excerpt.replace(/"/g, '\\\"')}"\ntags: "${values.tags}"\npythonPackages: "${values.pythonPackages}"\n---\n\n${values.content.trim()}\n`;
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

export function deletePostFile(slug: string) {
  const filePath = path.join(postsDirectory, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    throw new Error('Post not found.');
  }

  fs.unlinkSync(filePath);
}
