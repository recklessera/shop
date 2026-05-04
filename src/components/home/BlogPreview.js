import Image from 'next/image';
import Link from 'next/link';
import { Calendar } from 'lucide-react';

export default function BlogPreview({ posts }) {
  if (!posts || posts.length === 0) return null;

  return (
    <div className="w-full bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl font-bold uppercase tracking-tighter text-brand-black mb-2">
              From the Era
            </h2>
            <p className="text-gray-500">Culture, style, and stories from the movement.</p>
          </div>
          <Link 
            href="/journal" 
            className="border-b-2 border-brand-primary pb-1 text-sm font-bold uppercase tracking-widest hover:text-brand-accent hover:border-brand-accent transition-colors shrink-0"
          >
            Read the Journal
          </Link>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => {
            // Format the date dynamically
            const formattedDate = new Date(post.published_at).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            });

            // Strip HTML tags for a clean excerpt, then truncate
            const rawText = post.content?.replace(/<[^>]+>/g, '') || "";
            const excerpt = rawText.length > 120 ? rawText.substring(0, 120) + "..." : rawText;

            return (
              <Link 
                key={post.id} 
                href={`/journal/${post.slug}`}
                className="group flex flex-col cursor-pointer"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 mb-6 rounded-lg">
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
                  <div className="flex items-center text-xs text-brand-accent font-bold tracking-widest uppercase">
                    <Calendar className="w-3 h-3 mr-2" />
                    {formattedDate}
                  </div>
                  
                  <h3 className="text-xl font-bold text-brand-black leading-snug group-hover:text-brand-accent transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {excerpt}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
        
      </div>
    </div>
  );
}