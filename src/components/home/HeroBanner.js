import Image from 'next/image';
import Link from 'next/link';

export default function HeroBanner({ bannerUrl }) {
  return (
    <div className="relative w-full h-[50vh] min-h-[350px] md:h-[70vh] md:min-h-[500px] flex items-center justify-center overflow-hidden">
      
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={bannerUrl}
          alt="Reckless Era Latest Campaign"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Dark overlay to ensure text readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-4 flex flex-col items-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white uppercase tracking-tighter mb-4 md:mb-6">
          Define Your Era
        </h1>
        <p className="text-base md:text-xl text-gray-200 mb-6 md:mb-8 max-w-lg text-center">
          Premium quality pieces built for those who refuse to blend in. (Pre-order ends 18th of September).
        </p>
        <Link 
          href="/shop" 
          className="bg-brand-primary text-brand-secondary px-6 py-3 md:px-8 md:py-4 font-bold tracking-wide uppercase hover:bg-brand-gold-hover hover:text-black transition-all duration-300 shadow-lg text-sm md:text-base"
        >
          Pre-order Now
        </Link>
      </div>
      
    </div>
  );
}