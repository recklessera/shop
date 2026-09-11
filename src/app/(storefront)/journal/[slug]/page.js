import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from "@/lib/prisma";
import { Calendar, ChevronLeft, User } from 'lucide-react';

// Dynamically generate the SEO metadata for each specific blog post
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await prisma.blog.findUnique({ where: { slug } });
  
  if (!post) return { title: "Post Not Found" };
  
  return {
    title: post.title,
    description: post.content?.replace(/<[^>]+>/g, '').substring(0, 160) || "Read this article on Reckless Era.",
    openGraph: {
      images: post.featured_image_url ? [post.featured_image_url] : [],
    }
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;

  // Fetch the specific post based on the URL slug
  const post = await prisma.blog.findUnique({
    where: { 
      slug: slug,
      status: 'published' // Ensure users can't manually navigate to draft URLs
    },
    include: { author: true }
  });

  if (!post) {
    notFound(); // Triggers the Next.js 404 page if the slug doesn't exist
  }

  const formattedDate = new Date(post.published_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <article className="w-full bg-white min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <Link 
          href="/journal" 
          className="inline-flex items-center text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-brand-primary transition-colors mb-12"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Journal
        </Link>

        {/* Article Header */}
        <header className="mb-12 text-center">
          <div className="flex justify-center items-center gap-6 text-xs text-brand-primary font-bold tracking-widest uppercase mb-6">
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {formattedDate}
            </span>
            {post.author?.name && (
              <span className="flex items-center text-gray-500">
                <User className="w-4 h-4 mr-2" />
                By {post.author.name}
              </span>
            )}
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tighter text-black leading-tight mb-8">
            {post.title}
          </h1>
        </header>

      </div>

      {/* Featured Image (Full Bleed on Mobile, Contained on Desktop) */}
      {post.featured_image_url && (
        <div className="w-full max-w-5xl mx-auto mb-16 px-0 sm:px-6 lg:px-8">
          <div className="relative aspect-[16/9] w-full overflow-hidden sm:rounded-lg shadow-xl">
            <Image
              src={post.featured_image_url}
              alt={post.title}
              fill
              className="object-cover object-center"
              priority
            />
          </div>
        </div>
      )}

      {/* Article Content (Injected HTML) */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div 
          className="prose prose-lg prose-gray max-w-none 
                     prose-headings:font-bold prose-headings:uppercase prose-headings:tracking-tighter prose-headings:text-black
                     prose-a:text-brand-primary prose-a:font-bold hover:prose-a:text-brand-accent
                     prose-img:rounded-lg prose-img:shadow-md
                     text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        {/* End of article marker */}
        <div className="mt-16 pt-8 border-t border-gray-200 flex justify-center">
          <div className="w-3 h-3 bg-brand-primary transform rotate-45"></div>
        </div>
      </div>
    </article>
  );
}