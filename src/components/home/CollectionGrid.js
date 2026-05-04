import Image from 'next/image';
import Link from 'next/link';

export default function CollectionGrid({ collections }) {
  // 1. Only display the latest 3 collections
  const latestCollections = collections?.slice(0, 3) || [];

  if (latestCollections.length === 0) return null;

  return (
    <div className="w-full py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12 border-b border-gray-100 pb-6">
          <div>
            <h2 className="text-4xl font-bold uppercase tracking-tighter text-black">
              The Archives
            </h2>
            <p className="text-gray-500 text-sm mt-2 uppercase tracking-widest font-medium">
              Curated Chapters of the Era
            </p>
          </div>
          <Link href="/shop" className="text-xs font-bold uppercase tracking-[0.2em] border-b-2 border-black pb-1 hover:text-brand-gold hover:border-brand-gold transition-all">
            Explore All
          </Link>
        </div>

        {/* Grid Layout with Folder-ish Styling */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {latestCollections.map((collection) => (
            <Link 
              key={collection.id} 
              href={`/shop?collection=${encodeURIComponent(collection.title)}`} // Directs to filtered shop
              className="group relative flex flex-col"
            >
              {/* Folder Tab Effect */}
              <div className="w-1/2 h-6 bg-gray-100 rounded-t-lg transition-colors group-hover:bg-brand-primary" 
                   style={{ clipPath: 'polygon(0 0, 85% 0, 100% 100%, 0% 100%)' }} 
              />

              {/* Main Folder Body */}
              <div className="relative h-[450px] w-full overflow-hidden shadow-sm group-hover:shadow-2xl transition-all duration-500 border border-gray-100">
                {collection.cover_image_url ? (
                  <Image
                    src={collection.cover_image_url}
                    alt={collection.title}
                    fill
                    className="object-cover object-center transition-transform duration-1000 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Missing Visual</span>
                  </div>
                )}

                {/* Branded Overlay */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                
                {/* Text Content */}
                <div className="absolute inset-x-0 bottom-0 p-8">
                  <div className="flex items-center gap-4 mb-2 overflow-hidden">
                    <div className="h-[1px] w-8 bg-brand-gold transition-transform duration-500 -translate-x-12 group-hover:translate-x-0" />
                    <span className="text-[10px] text-brand-gold font-black uppercase tracking-[0.3em]">
                      Collection
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white uppercase tracking-tighter drop-shadow-lg">
                    {collection.title}
                  </h3>
                </div>
              </div>

              {/* Folder Footer (Optional Detail) */}
              <div className="mt-4 flex justify-between items-center px-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  View Series
                </span>
                <div className="h-2 w-2 bg-gray-200 rounded-full group-hover:bg-brand-gold transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}