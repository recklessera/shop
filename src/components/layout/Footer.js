import Link from 'next/link';
import { Mail } from 'lucide-react';

export default function Footer({ settings }) {
  // PASTE YOUR EXACT WHATSAPP CHANNEL LINK HERE:
  const whatsappChannelLink = "https://whatsapp.com/channel/0029VbCvn2hCnA80I9oDFo0Z";

  return (
    <footer className="bg-sidebar-bg text-gray-400 py-16 border-t border-sidebar-hover mt-auto font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Brand & Contact */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-2xl font-bold tracking-tighter uppercase text-brand-primary">
              Reckless Era
            </h3>
            <p className="text-sm leading-relaxed">
              OFF COURSE. ON PURPOSE. Premium quality pieces built for those who refuse to blend in.
            </p>
            {settings?.contact_email && (
              <a href={`mailto:${settings.contact_email}`} className="flex items-center text-sm hover:text-brand-primary transition-colors mt-4">
                <Mail className="w-4 h-4 mr-2" />
                {settings.contact_email}
              </a>
            )}
          </div>
          
          {/* Column 2: Navigation */}
          <div className="flex flex-col space-y-3 text-sm">
            <h4 className="font-bold text-white mb-2 tracking-widest uppercase text-xs">Explore</h4>
            <Link href="/shop" className="hover:text-brand-primary transition-colors">Shop All</Link>
            <Link href="/collections" className="hover:text-brand-primary transition-colors">Collections</Link>
            <Link href="/lookbook" className="hover:text-brand-primary transition-colors">The Lookbook</Link>
            <Link href="/journal" className="hover:text-brand-primary transition-colors">Journal</Link>
          </div>

          {/* Column 3: Legal & Support */}
          <div className="flex flex-col space-y-3 text-sm">
            <h4 className="font-bold text-white mb-2 tracking-widest uppercase text-xs">Support</h4>
            <Link href="/privacy-policy" className="hover:text-brand-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-brand-primary transition-colors">Terms of Service</Link>
            <Link href="/returns" className="hover:text-brand-primary transition-colors">Returns & Refunds</Link>
            <Link href="/shipping" className="hover:text-brand-primary transition-colors">Shipping Info</Link>
          </div>
          
          {/* Column 4: Community & Socials */}
          <div className="flex flex-col">
            <h4 className="font-bold text-white mb-2 tracking-widest uppercase text-xs">The Inner Circle</h4>
            <p className="text-sm mb-6 text-gray-400">Get early access to drops and secret collections directly to your phone.</p>
            
            {/* WhatsApp Channel Button */}
            <a 
              href={whatsappChannelLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-brand-primary text-black px-6 py-3 font-bold tracking-widest uppercase hover:bg-brand-accent hover:text-white transition-all duration-300 rounded-sm text-xs w-max mb-8 group"
            >
              <svg 
                viewBox="0 0 24 24" 
                width="16" 
                height="16" 
                className="mr-2 fill-current group-hover:scale-110 transition-transform duration-300"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.81 11.81 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413Z"/>
              </svg>
              Join WhatsApp
            </a>
            
            {/* Social Links Row */}
            <div className="flex space-x-6 items-center">
              {settings?.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-primary transition-colors">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
              )}
              {settings?.twitter_url && (
                <a href={settings.twitter_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-primary transition-colors">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              )}
              {settings?.tiktok_url && (
                <a href={settings.tiktok_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-primary transition-colors">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>

        </div>

        {/* Bottom Row: Cookie Consent & Copyright */}
        <div className="pt-8 border-t border-sidebar-hover text-xs text-gray-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} Reckless Era. All rights reserved.</p>
          <div className="flex gap-4">
            <span>We use cookies to improve your experience and comply with GDPR/NDPR.</span>
          </div>
        </div>

      </div>
    </footer>
  );
}