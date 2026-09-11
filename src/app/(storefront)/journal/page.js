import Image from 'next/image';
import Link from 'next/link';
import { prisma } from "@/lib/prisma";
import { Calendar, User } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Journal",
  description: "Culture, style, and stories from the movement.",
};

export default async function JournalPage() {
  // Fetch all published blog posts and include the author's data
  const posts = await prisma.blog.findMany({
    where: { status: 'published' }, // using lowercase based on your previous fix
    orderBy: { published_at: 'desc' },
    include: { author: true }
  });

  return (
    <div className="w-full bg-white min-h-screen py-16">
      
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <h1 className="text-5xl md:text-6xl font-bold uppercase tracking-tighter text-black mb-6">
          The Journal
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Culture, style, and stories from the Reckless Era movement.
        </p>
      </div>

      {/* Blog Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {posts.length === 0 ? (
          <div className="text-center py-20 text-gray-500 italic">
            No articles published yet. Check back soon.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {posts.map((post) => {
              const formattedDate = new Date(post.published_at).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              });

              // Strip HTML tags for the excerpt
              const rawText = post.content?.replace(/<[^>]+>/g, '') || "";
              const excerpt = rawText.length > 150 ? rawText.substring(0, 150) + "..." : rawText;

              return (
                <Link 
                  key={post.id} 
                  href={`/journal/${post.slug}`}
                  className="group flex flex-col cursor-pointer"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 mb-6 rounded-sm">
                    {post.featured_image_url ? (
                      <Image
                        src={post.featured_image_url}
                        alt={post.title}
                        fill
                        className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Article Info */}
                  <div className="flex flex-col space-y-3">
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 font-bold tracking-widest uppercase">
                      <span className="flex items-center text-brand-primary">
                        <Calendar className="w-3 h-3 mr-2" />
                        {formattedDate}
                      </span>
                      {post.author?.name && (
                        <span className="flex items-center">
                          <User className="w-3 h-3 mr-2" />
                          {post.author.name}
                        </span>
                      )}
                    </div>
                    
                    <h2 className="text-2xl font-bold text-black leading-snug group-hover:text-brand-primary transition-colors">
                      {post.title}
                    </h2>
                    
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {excerpt}
                    </p>

                    <span className="text-sm font-bold uppercase tracking-widest text-brand-primary mt-2 group-hover:text-brand-accent transition-colors">
                      Read Full Article &rarr;
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}