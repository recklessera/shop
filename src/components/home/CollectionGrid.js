import Image from 'next/image';
import Link from 'next/link';

export default function CollectionGrid({ collections }) {
  if (!collections || collections.length === 0) return null;

  return (
    <div className="w-full py-16">
      <h2 className="text-3xl font-bold uppercase tracking-tighter mb-12 text-center text-black">
        View All Collections
      </h2>

      {/* Grid Layout: 1 column on mobile, 2 on tablet, 3 on large screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 px-4 sm:px-6 lg:px-8 max-w-screen-2xl mx-auto">
        {collections.map((collection) => (
          <Link 
            key={collection.id} 
            href={`/collections/${collection.slug}`}
            className="group relative h-[400px] md:h-[500px] w-full overflow-hidden block rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-500"
          >
            {/* Background Image */}
            {collection.cover_image_url ? (
              <Image
                src={collection.cover_image_url}
                alt={collection.title}
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">No Image</span>
              </div>
            )}

            {/* Dark Gradient Overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:via-black/40 transition-colors duration-500" />

            {/* Text Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
              <h3 className="text-3xl md:text-4xl font-bold text-white uppercase tracking-widest text-center group-hover:scale-110 transition-transform duration-500 drop-shadow-md">
                {collection.title}
              </h3>
              
              {/* Subtle underline that expands on hover */}
              <div className="h-0.5 w-0 bg-brand-gold mt-4 transition-all duration-500 group-hover:w-24" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}