"use client"; // Add this to the very top!

import { useState } from 'react'; // FIXED: Added missing useState import
import Link from 'next/link';
import { Mail, MessageCircle } from 'lucide-react';
import PolicyDrawer from './PolicyDrawer'; // Import the new component

export default function Footer({ settings }) {
  // PASTE YOUR EXACT WHATSAPP CHANNEL LINK HERE:
  const whatsappChannelLink = "https://whatsapp.com/channel/0029VbCvn2hCnA80I9oDFo0Z";

  // NEW: State to manage the drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerType, setDrawerType] = useState('shipping');

  const openDrawer = (type) => {
    setDrawerType(type);
    setIsDrawerOpen(true);
  };

  return (
    <> {/* FIXED: Added opening fragment tag here! */}
      <footer className="bg-sidebar-bg text-gray-400 py-16 border-t border-sidebar-hover mt-auto font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Main Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            
            {/* Column 1: Brand & Contact */}
            <div className="flex flex-col space-y-4">
              <h3 className="text-2xl font-bold tracking-tighter uppercase text-brand-primary">
                Reckless Era
              </h3>
              <p className="text-sm leading-relaxed mb-4">
                OFF COURSE. ON PURPOSE. Premium quality pieces built for those who refuse to blend in.
              </p>

              <div className="space-y-4 pt-2 border-t border-sidebar-hover/50">
                {/* Order Support Email */}
                {settings?.contact_email && (
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">
                      Support & Complaints
                    </p>
                    <p className="text-xs text-gray-400 mb-2">
                      Contact this email for all order-related issues:
                    </p>
                    <a href={`mailto:${settings.contact_email}`} className="flex items-center text-sm text-white hover:text-brand-primary transition-colors">
                      <Mail className="w-4 h-4 mr-2" />
                      {settings.contact_email}
                    </a>
                  </div>
                )}

                {/* Customer Service WhatsApp */}
                {settings?.whatsapp_number && (
                  <div className="pt-2">
                    <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">
                      Customer Service
                    </p>
                    <p className="text-xs text-gray-400 mb-2">
                      Message us directly for general inquiries:
                    </p>
                    <a 
                      href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center text-sm text-white hover:text-brand-primary transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      {settings.whatsapp_number}
                    </a>
                  </div>
                )}
              </div>
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
              <Link href="/privacy-policy" className="hover:text-brand-primary transition-colors w-max">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-brand-primary transition-colors w-max">Terms of Service</Link>
              
              {/* Changed from Link to Button */}
              <button 
                onClick={() => openDrawer('returns')} 
                className="hover:text-brand-primary transition-colors text-left w-max"
              >
                Returns & Refunds
              </button>
              
              <button 
                onClick={() => openDrawer('shipping')} 
                className="hover:text-brand-primary transition-colors text-left w-max"
              >
                Shipping Info
              </button>
            </div>
            
            {/* Column 4: Community & Socials */}
            <div className="flex flex-col">
              <h4 className="font-bold text-white mb-2 tracking-widest uppercase text-xs">The Reckless Society</h4>
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
                Join the WhatsApp community
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
                <a href="https://www.snapchat.com/add/recklessera1" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-primary transition-colors">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M12.112 0c-.571 0-1.28.06-2.126.176a9.58 9.58 0 0 0-3.327 1.109c-1.127.65-1.928 1.405-2.39 2.247-.487.887-.665 1.94-.526 3.125.105.897.433 1.9 1.01 3.093l.235.485c.148.307.258.552.33.738a.952.952 0 0 1 .054.43c-.027.271-.166.529-.408.756-.375.352-.89.605-1.503.74-.537.118-1.048.117-1.49-.003a2.383 2.383 0 0 1-.957-.463 1.83 1.83 0 0 0-1.1-.426c-.34 0-.671.126-1.002.385-.634.495-.778 1.17-.417 1.956.12.261.341.564.673.918.528.563 1.347 1.157 2.454 1.777.495.277 1.033.565 1.62.868.21.108.384.276.536.52.176.28.271.618.286 1.011v.17c-.015.549-.168 1.042-.454 1.458a2.535 2.535 0 0 1-1.37.98 2.052 2.052 0 0 0-1.42 1.48c-.085.344-.065.71.058 1.096.182.573.57 1.003 1.157 1.285.358.172.842.27 1.451.298 1.014.047 2.072-.194 3.178-.718l.745-.355c.34-.161.642-.243.906-.245.26 0 .524.084.793.255a22.75 22.75 0 0 0 2.215 1.22c.745.355 1.468.6 2.181.745.718.145 1.353.195 1.905.152a5.45 5.45 0 0 0 2.316-.69 2.058 2.058 0 0 0 .97-1.436c.071-.34-.047-.723-.356-1.155a3.738 3.738 0 0 0-1.205-.98c-.286-.145-.515-.314-.688-.507a2.008 2.008 0 0 1-.497-1.492c.01-.58.172-1.096.48-1.536.26-.37.608-.667 1.04-.889a20.08 20.08 0 0 0 1.545-.828c1.108-.622 1.93-1.22 2.46-1.78.334-.356.556-.66.674-.916.363-.787.218-1.462-.416-1.956a1.737 1.737 0 0 0-1.006-.385c-.413 0-.785.143-1.11.426-.356.31-.676.464-.95.463a3.3 3.3 0 0 1-1.483-.007c-.604-.13-1.112-.373-1.478-.714-.236-.22-.366-.464-.385-.718-.019-.249.006-.475.074-.668.082-.236.208-.5.378-.795l.217-.464c.579-1.233.913-2.27 1.01-3.111.137-1.18-.044-2.227-.525-3.109-.462-.843-1.264-1.597-2.39-2.247A9.563 9.563 0 0 0 14.18.176C13.332.06 12.637.001 12.11 0h.001z"/>
                  </svg>
                </a>
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
      
      {/* NEW: Render the drawer outside the footer layout */}
      <PolicyDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        policyType={drawerType}
      />
    </> 
  );
}