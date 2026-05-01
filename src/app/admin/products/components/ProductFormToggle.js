'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'

export default function ProductFormToggle({ children }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="w-full flex flex-col items-center">
      {/* The Pill Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold text-white transition-all duration-300 shadow-lg hover:-translate-y-0.5 ${
          isOpen 
            ? 'bg-gray-800 hover:bg-gray-900 shadow-gray-900/20' 
            : 'bg-brand-pink hover:bg-brand-pink/90 shadow-brand-pink/20'
        }`}
      >
        {isOpen ? (
          <>
            <X className="h-4 w-4" /> Cancel & Close
          </>
        ) : (
          <>
            <Plus className="h-4 w-4" /> Add New Product
          </>
        )}
      </button>

      {/* The Expanding Dropdown Area */}
      {isOpen && (
        <div className="w-full mt-8 animate-in fade-in slide-in-from-top-4 duration-500">
          {children}
        </div>
      )}
    </div>
  )
}