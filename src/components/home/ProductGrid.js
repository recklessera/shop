import Image from 'next/image';
import Link from 'next/link';

export default function ProductGrid({ products }) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 italic">
        No new arrivals found. Check back soon!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {products.map((product) => {
        // Extract the primary image safely
        const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0];
        
        // NEW: Calculate stock status
        const totalStock = product.variants?.reduce((acc, v) => acc + v.stock_count, 0) || 0;
        const isSoldOut = totalStock === 0;

        return (
          <Link 
            key={product.id} 
            href={`/shop/${product.slug}`}
            className="group flex flex-col cursor-pointer relative"
          >
            {/* Image Container */}
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100 mb-4 rounded-sm">
              {primaryImage ? (
                <Image
                  src={primaryImage.image_url}
                  alt={primaryImage.alt_text || product.title}
                  fill
                  className={`object-cover object-center transition-transform duration-700 group-hover:scale-105 ${isSoldOut ? 'opacity-50' : ''}`}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs font-bold uppercase">
                  No Image
                </div>
              )}

              {/* NEW: Sold Out Badge */}
              {isSoldOut && (
                <div className="absolute top-3 left-3 bg-black text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest z-10 shadow-lg">
                  Sold Out
                </div>
              )}
              
              {/* Optional: Add to Cart Quick Action (Hidden if Sold Out) */}
              {!isSoldOut && (
                <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <button className="w-full bg-brand-primary text-brand-secondary py-3 font-bold text-sm tracking-wide uppercase hover:bg-brand-gold transition-colors shadow-xl">
                    View Details
                  </button>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col space-y-1">
              <h3 className={`text-sm font-bold uppercase tracking-tight transition-colors ${isSoldOut ? 'text-gray-400' : 'text-black group-hover:text-brand-accent'}`}>
                {product.title}
              </h3>
              <p className={`text-sm font-medium ${isSoldOut ? 'text-gray-400' : 'text-gray-600'}`}>
                ₦{product.price.toLocaleString()}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}