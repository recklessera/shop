"use client";

import Link from 'next/link';
import { ShoppingCart, User, Menu } from 'lucide-react';

export default function StickyNavbar() {
  return (
    <header className="sticky top-0 z-50 bg-brand-secondary border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Mobile Menu Button (Hidden on Desktop) */}
          <div className="flex items-center md:hidden">
            <button className="text-foreground p-2 hover:text-brand-accent transition-colors">
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold text-brand-primary tracking-tighter uppercase">
              Reckless Era
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/shop" className="text-foreground hover:text-brand-accent transition-colors font-medium">Shop</Link>
            <Link href="/collections" className="text-foreground hover:text-brand-accent transition-colors font-medium">Collections</Link>
            <Link href="/lookbook" className="text-foreground hover:text-brand-accent transition-colors font-medium">Lookbook</Link>
            <Link href="/journal" className="text-foreground hover:text-brand-accent transition-colors font-medium">Journal</Link>
          </nav>

          {/* User Account & Cart Actions */}
          <div className="flex items-center space-x-4">
            <Link href="/account" className="text-foreground hover:text-brand-accent transition-colors p-2">
              <User className="h-5 w-5" />
            </Link>
            
            {/* Cart Trigger Button */}
            <button className="text-foreground hover:text-brand-accent transition-colors p-2 relative">
              <ShoppingCart className="h-5 w-5" />
              {/* Cart Item Badge (Static for now, will connect to Zustand later) */}
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-brand-secondary bg-brand-accent rounded-full transform translate-x-1/4 -translate-y-1/4">
                0
              </span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}