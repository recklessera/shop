import Image from 'next/image';
import Link from 'next/link';

export default function HeroBanner({ bannerUrl }) {
  return (
    <div className="relative w-full h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
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
        <h1 className="text-4xl md:text-6xl font-bold text-white uppercase tracking-tighter mb-6">
          Define Your Era
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-lg text-center">
          Premium quality pieces built for those who refuse to blend in.
        </p>
        <Link 
          href="/shop" 
          className="bg-brand-primary text-brand-secondary px-8 py-4 font-bold tracking-wide uppercase hover:bg-brand-gold-hover hover:text-black transition-all duration-300 shadow-lg"
        >
          Shop Now
        </Link>
      </div>
    </div>
  );
}