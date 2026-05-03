import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-sidebar-bg text-brand-secondary py-12 border-t border-sidebar-hover mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Column */}
          <div>
            <h3 className="text-xl font-bold mb-4 tracking-tighter uppercase text-brand-secondary">Reckless Era</h3>
            <p className="text-sm text-gray-400">Join the cult. Premium quality, from the era.</p>
          </div>
          
          {/* Legal Links Column */}
          <div className="flex flex-col space-y-3 text-sm text-gray-300">
            <h4 className="font-bold text-white mb-1">Legal</h4>
            <Link href="/privacy-policy" className="hover:text-brand-accent transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-brand-accent transition-colors">Terms of Service</Link>
            <Link href="/returns" className="hover:text-brand-accent transition-colors">Returns & Refunds</Link>
          </div>
          
          {/* Newsletter / Contact Column */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm">Stay Updated</h4>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-sidebar-hover text-white px-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-brand-accent text-sm" 
              />
              <button className="bg-brand-primary text-brand-secondary px-4 py-2 hover:bg-brand-gold transition-colors font-bold text-sm">
                JOIN
              </button>
            </div>
          </div>
        </div>

        {/* Cookie Consent & Copyright */}
        <div className="pt-8 border-t border-sidebar-hover text-xs text-gray-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} Reckless Era. All rights reserved.</p>
          <p>We use cookies to improve your experience and comply with GDPR/NDPR regulations.</p>
        </div>

      </div>
    </footer>
  );
}