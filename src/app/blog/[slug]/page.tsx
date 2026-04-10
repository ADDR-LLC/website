import { getPostData, getSortedPostsData } from '@/lib/blog';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Calendar } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import { PythonRunner } from '@/components/python-runner';

const ALLOWED_EMBED_HOSTS = new Set(['codepen.io', 'codesandbox.io', 'stackblitz.com']);

function getMarkdownComponents(pythonPackages: string[] = []): Components {
  return {
    code({ className, children, ...props }) {
      const raw = String(children).trim();

      if (className === 'language-embed') {
        try {
          const embedUrl = new URL(raw);

          if (!ALLOWED_EMBED_HOSTS.has(embedUrl.hostname)) {
            return (
              <p className="text-sm text-red-300 border border-red-800/60 bg-red-900/20 rounded-md p-3">
                Blocked embed host: <strong>{embedUrl.hostname}</strong>
              </p>
            );
          }

          return (
            <div className="my-6 rounded-xl overflow-hidden border border-[#2C2C2E]">
              <iframe
                title={`Embedded demo from ${embedUrl.hostname}`}
                src={embedUrl.toString()}
                loading="lazy"
                className="w-full min-h-[380px] bg-[#0a0a0a]"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              />
            </div>
          );
        } catch {
          return <p className="text-sm text-red-300">Invalid embed URL in embed code block.</p>;
        }
      }

      if (className === 'language-python-run') {
        return <PythonRunner code={raw} packages={pythonPackages} />;
      }

      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };
}

export async function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostData(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="bg-[#000000] min-h-screen text-white pt-24 pb-20 px-4 md:px-8 lg:px-16 relative">
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-[#0a0a0a] to-transparent z-0"></div>

      <article className="max-w-3xl mx-auto relative z-10 animate-in fade-in duration-1000">
        <div className="mb-12">
          <Link
            href="/blog"
            className="inline-flex items-center text-[#95bdc9] hover:text-white transition-colors duration-300 mb-8 font-medium"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to all posts
          </Link>

          <div className="flex items-center gap-2 text-[#888888] text-sm mb-4 font-mono">
            <Calendar className="w-4 h-4" />
            <time>{new Date(post.date).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}</time>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#e8e8e8] mb-6">
            {post.title}
          </h1>

          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags?.map((tag) => (
              <span key={tag} className="text-xs px-2 py-1 rounded bg-[#111111] border border-[#505050] text-[#95bdc9]">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="prose prose-invert prose-lg max-w-none prose-headings:text-[#e8e8e8] prose-a:text-[#95bdc9] hover:prose-a:text-white prose-a:transition-colors prose-p:text-[#888888] prose-strong:text-white prose-li:text-[#888888]">
          <ReactMarkdown components={getMarkdownComponents(post.pythonPackages)}>{post.content}</ReactMarkdown>
        </div>
      </article>
    </div>
  );
}
