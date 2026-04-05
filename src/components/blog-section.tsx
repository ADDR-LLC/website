import Link from 'next/link';
import { getSortedPostsData } from '@/lib/blog';
import { Calendar, ArrowRight } from 'lucide-react';

export function BlogSection() {
  const posts = getSortedPostsData();

  return (
    <section id="blog" className="bg-[#000000] text-white py-16 md:py-24 px-4 md:px-12 lg:px-24 overflow-hidden relative w-full flex-1">
      <div className="max-w-7xl mx-auto relative z-10 flex flex-col gap-16 w-full">
        <div className="text-left animate-in fade-in duration-1000 w-full">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-[#e8e8e8] to-[#95bdc9] mb-4 pb-2 drop-shadow-[0_0_15px_rgba(126,227,135,0.2)]">
            Blog
          </h2>
          <p className="text-[#a0a0a5] font-light text-base md:text-lg">
            Latest news, updates, and insights from the ADDR team.
          </p>
        </div>

        <div className="flex flex-col gap-8 w-full animate-in fade-in duration-1000">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block bg-[#1C1C1E] rounded-2xl p-8 transition-all duration-500 border border-[#2C2C2E] hover:-translate-y-1 text-left w-full"
            >
              <div className="flex items-center gap-2 text-[#95bdc9] text-sm mb-4 font-mono">
                <Calendar className="w-4 h-4" />
                <time>{new Date(post.date).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}</time>
              </div>

              <h3 className="text-xl md:text-2xl font-bold text-[#e8e8e8] mb-3 tracking-tight group-hover:text-white transition-colors duration-300">
                {post.title}
              </h3>

              <p className="text-[#a0a0a5] font-light leading-relaxed mb-6 max-w-3xl text-sm md:text-base">
                {post.excerpt}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags?.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-1 rounded bg-[#000000] border border-[#2C2C2E] text-[#a0a0a5]">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center text-[#95bdc9] font-medium text-sm group-hover:tracking-wider transition-all duration-300">
                Read article <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
