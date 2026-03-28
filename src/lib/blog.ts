import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  tags?: string[];
}

const postsDirectory = path.join(process.cwd(), 'src/content/blog');

export function getSortedPostsData(): BlogPost[] {
  if (!fs.existsSync(postsDirectory)) return [];
  
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.mdx') || fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx?$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      
      const { data, content } = matter(fileContents);
      
      return {
        slug,
        title: data.title || 'Untitled',
        date: data.date || '2024-01-01',
        excerpt: data.excerpt || '',
        tags: data.tags ? (typeof data.tags === 'string' ? data.tags.split(',').map((t: string) => t.trim()) : data.tags) : [],
        content
      };
    });

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostData(slug: string): BlogPost | undefined {
  const posts = getSortedPostsData();
  return posts.find(post => post.slug === slug);
}
