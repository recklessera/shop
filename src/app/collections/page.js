import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';

export const metadata = {
  title: 'The Archives | Reckless Era',
  description: 'Explore all past and present collections from Reckless Era.',
};

export default async function CollectionsPage() {
  // Fetch all collections from your database.
  // Using id: 'desc' as a fallback to get the most recently added collections first.
  const collections = await prisma.collection.findMany({
    orderBy: { id: 'desc' },
  });

  if (!collections || collections.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl font-bold uppercase tracking-tighter text-black mb-4">The Archives</h1>
        <p className="text-gray-500 uppercase tracking-widest text-xs font-bold">No collections found.</p>
      </div>
    );
  }

  // Separate the latest collection for the Hero section, and the rest for the Grid
  const featuredCollection = collections[0];
  const gridCollections = collections.slice(1);

  return (
    <div className="min-h-screen bg-white pb-24 font-sans">
      
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 text-center">
        <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter text-black mb-4">
          The Archives
        </h1>
        <p className="text-gray-500 uppercase tracking-widest text-xs font-bold">
          Off Course. On Purpose.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 md:space-y-8">
        
        {/* 1. FEATURED HERO COLLECTION */}
        <Link 
          href={`/shop?collection=${featuredCollection.id}`}
          className="block relative w-full h-[60vh] md:h-[75vh] group overflow-hidden bg-black"
        >
          {/* Defensive Image Logic: Prefer Banner -> Fallback to Cover -> Fallback to Black Background */}
          {(featuredCollection.banner_image_url || featuredCollection.cover_image_url) ? (
            <Image 
              src={featuredCollection.banner_image_url || featuredCollection.cover_image_url}
              alt={featuredCollection.title}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-80 group-hover:opacity-60"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-brand-secondary opacity-90" />
          )}

          {/* Featured Text Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 transition-transform duration-500">
            <span className="text-white/80 uppercase tracking-[0.3em] text-[10px] font-bold mb-4">
              Latest Drop
            </span>
            <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter text-white mb-6">
              {featuredCollection.title}
            </h2>
            {featuredCollection.description && (
              <p className="text-white/90 text-sm md:text-base max-w-md mx-auto mb-8 hidden md:block">
                {featuredCollection.description}
              </p>
            )}
            <span className="inline-block bg-white text-black px-8 py-4 font-bold uppercase tracking-widest text-xs hover:bg-brand-primary transition-colors">
              Explore Collection
            </span>
          </div>
        </Link>

        {/* 2. THE GRID (Past Collections) */}
        {gridCollections.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            {gridCollections.map((collection) => (
              <Link 
                key={collection.id}
                href={`/shop?collection=${encodeURIComponent(collection.title)}`}
                className="block relative w-full aspect-[4/5] group overflow-hidden bg-black"
              >
                {/* Defensive Image Logic: Prefer Cover -> Fallback to Banner -> Fallback to Black Background */}
                {(collection.cover_image_url || collection.banner_image_url) ? (
                  <Image 
                    src={collection.cover_image_url || collection.banner_image_url}
                    alt={collection.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-70 group-hover:opacity-50"
                  />
                ) : (
                  <div className="absolute inset-0 bg-sidebar-bg opacity-90" />
                )}

                {/* Grid Text Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                  <h3 className="text-3xl md:text-4xl font-bold uppercase tracking-tighter text-white mb-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    {collection.title}
                  </h3>
                  <span className="inline-block border-2 border-white text-white px-6 py-3 font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-colors opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75">
                    View Drop
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}