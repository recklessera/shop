"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, User, Menu, X } from 'lucide-react'; // Added 'X' icon
import { useCartStore } from '@/store/cartStore';

export default function StickyNavbar() {
  const { items, toggleCart } = useCartStore();
  
  // States
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // New state

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="sticky top-0 z-[100] bg-brand-secondary border-b border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
              className="text-white p-2 hover:text-brand-primary transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-8 h-8 md:w-10 md:h-10 transition-transform duration-300 group-hover:scale-105">
                <Image 
                  src="/logo.png" 
                  alt="Reckless Era Logo" 
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-xl md:text-2xl font-bold text-brand-primary tracking-tighter uppercase group-hover:text-brand-accent transition-colors">
                Reckless Era
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {/* ADDED: Home Link */}
            <Link href="/" className="text-white hover:text-brand-primary transition-colors font-medium">Home</Link>
            <Link href="/shop" className="text-white hover:text-brand-primary transition-colors font-medium">Shop</Link>
            <Link href="/collections" className="text-white hover:text-brand-primary transition-colors font-medium">Collections</Link>
            <Link href="/lookbook" className="text-white hover:text-brand-primary transition-colors font-medium">Lookbook</Link>
            <Link href="/journal" className="text-white hover:text-brand-primary transition-colors font-medium">Journal</Link>
          </nav>

          {/* User Account & Cart Actions */}
          <div className="flex items-center space-x-4">
            <Link href="/account" aria-label="User Account" className="text-white hover:text-brand-primary transition-colors p-2">
              <User className="h-5 w-5" />
            </Link>
            
            <button onClick={toggleCart} aria-label="Open Cart" className="text-white hover:text-brand-primary transition-colors p-2 relative">
              <ShoppingCart className="h-5 w-5" />
              {isMounted && cartItemCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-black bg-brand-primary rounded-full transform translate-x-1/4 -translate-y-1/4">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <nav className="md:hidden bg-brand-secondary border-t border-gray-800">
          <div className="px-4 pt-2 pb-4 space-y-1 flex flex-col">
            {/* ADDED: Home Link for Mobile */}
            <Link onClick={() => setIsMobileMenuOpen(false)} href="/" className="text-white hover:text-brand-primary block px-3 py-2 font-medium">Home</Link>
            <Link onClick={() => setIsMobileMenuOpen(false)} href="/shop" className="text-white hover:text-brand-primary block px-3 py-2 font-medium">Shop</Link>
            <Link onClick={() => setIsMobileMenuOpen(false)} href="/collections" className="text-white hover:text-brand-primary block px-3 py-2 font-medium">Collections</Link>
            <Link onClick={() => setIsMobileMenuOpen(false)} href="/lookbook" className="text-white hover:text-brand-primary block px-3 py-2 font-medium">Lookbook</Link>
            <Link onClick={() => setIsMobileMenuOpen(false)} href="/journal" className="text-white hover:text-brand-primary block px-3 py-2 font-medium">Journal</Link>
          </div>
        </nav>
      )}
    </header>
  );
}