import Image from 'next/image';
import Link from 'next/link';

export default function ProductGrid({ products }) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No new arrivals found. Check back soon!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {products.map((product) => {
        // Extract the primary image if it exists
        const primaryImage = product.images?.[0]?.image_url;
        
        return (
          <Link 
            key={product.id} 
            href={`/shop/${product.slug}`}
            className="group flex flex-col cursor-pointer"
          >
            {/* Image Container */}
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100 mb-4">
              {primaryImage ? (
                <Image
                  src={primaryImage}
                  alt={product.images[0].alt_text || product.title}
                  fill
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
              
              {/* Optional: Add to Cart Quick Action */}
              <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <button className="w-full bg-brand-primary text-brand-secondary py-3 font-bold text-sm tracking-wide uppercase hover:bg-brand-gold transition-colors">
                  View Details
                </button>
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col space-y-1">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-tight group-hover:text-brand-accent transition-colors">
                {product.title}
              </h3>
              <p className="text-sm text-gray-600">
                ₦{product.price.toLocaleString()}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}