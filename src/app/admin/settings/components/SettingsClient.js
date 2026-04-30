'use client'

import { useState } from 'react'
import { updateStoreSettings } from '../actions'
import { Save, Image as ImageIcon, Link as LinkIcon, Mail, Palette } from 'lucide-react'

export default function SettingsClient({ settings }) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Safe fallback if settings haven't been created yet
  const currentSettings = settings || {}

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    const formData = new FormData(e.target)
    
    try {
      await updateStoreSettings(formData)
      alert("Settings saved successfully.")
    } catch (error) {
      alert(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto w-full text-left">
      <div className="mb-8 flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Store Appearance</h1>
        <p className="text-sm font-medium text-gray-500">Configure your storefront branding, social links, and contact details.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 flex flex-col">
        
        {/* Appearance & Branding */}
        <div className="bg-white border border-gray-100 p-6 md:p-8 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-brand-pink/10 rounded-lg">
              <Palette className="h-5 w-5 text-brand-pink" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Brand Assets</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Homepage Banner Image URL</label>
              <input 
                type="url" 
                name="homepage_banner_url" 
                defaultValue={currentSettings.homepage_banner_url || ''} 
                placeholder="https://..."
                className="block w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:border-brand-pink focus:ring-1 focus:ring-brand-pink focus:outline-none transition-all" 
              />
              <p className="text-xs font-medium text-gray-500 mt-2">Provide a high-res Cloudinary or external URL for the main hero image.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-100">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Primary Color</label>
                <div className="flex items-center gap-3">
                  <input type="color" name="theme_primary_color" defaultValue={currentSettings.theme_primary_color || '#000000'} className="h-10 w-10 cursor-pointer border-0 p-0 rounded-lg shadow-sm" />
                  <input type="text" defaultValue={currentSettings.theme_primary_color || '#000000'} className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium focus:border-brand-pink focus:ring-1 focus:ring-brand-pink focus:outline-none uppercase transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Secondary Color</label>
                <div className="flex items-center gap-3">
                  <input type="color" name="theme_secondary_color" defaultValue={currentSettings.theme_secondary_color || '#ffffff'} className="h-10 w-10 cursor-pointer border-0 p-0 rounded-lg shadow-sm" />
                  <input type="text" defaultValue={currentSettings.theme_secondary_color || '#ffffff'} className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium focus:border-brand-pink focus:ring-1 focus:ring-brand-pink focus:outline-none uppercase transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Accent Color</label>
                <div className="flex items-center gap-3">
                  <input type="color" name="theme_accent_color" defaultValue={currentSettings.theme_accent_color || '#ef4444'} className="h-10 w-10 cursor-pointer border-0 p-0 rounded-lg shadow-sm" />
                  <input type="text" defaultValue={currentSettings.theme_accent_color || '#ef4444'} className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium focus:border-brand-pink focus:ring-1 focus:ring-brand-pink focus:outline-none uppercase transition-all" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white border border-gray-100 p-6 md:p-8 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-brand-gold/10 rounded-lg">
              <Mail className="h-5 w-5 text-brand-gold-hover" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Contact Details</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Support Email</label>
              <input 
                type="email" 
                name="contact_email" 
                defaultValue={currentSettings.contact_email || ''} 
                placeholder="support@recklessera.com"
                className="block w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:border-brand-pink focus:ring-1 focus:ring-brand-pink focus:outline-none transition-all" 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">WhatsApp Business Number</label>
              <input 
                type="text" 
                name="whatsapp_number" 
                defaultValue={currentSettings.whatsapp_number || ''} 
                placeholder="+234..."
                className="block w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:border-brand-pink focus:ring-1 focus:ring-brand-pink focus:outline-none transition-all" 
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white border border-gray-100 p-6 md:p-8 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gray-100 rounded-lg">
              <LinkIcon className="h-5 w-5 text-gray-700" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Social Links</h3>
          </div>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Instagram URL</label>
              <input type="url" name="instagram_url" defaultValue={currentSettings.instagram_url || ''} placeholder="https://instagram.com/..." className="block w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:border-brand-pink focus:ring-1 focus:ring-brand-pink focus:outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Twitter / X URL</label>
              <input type="url" name="twitter_url" defaultValue={currentSettings.twitter_url || ''} placeholder="https://twitter.com/..." className="block w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:border-brand-pink focus:ring-1 focus:ring-brand-pink focus:outline-none transition-all" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">TikTok URL</label>
              <input type="url" name="tiktok_url" defaultValue={currentSettings.tiktok_url || ''} placeholder="https://tiktok.com/@..." className="block w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:border-brand-pink focus:ring-1 focus:ring-brand-pink focus:outline-none transition-all" />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pb-8">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-brand-gold text-white rounded-xl px-10 py-3.5 text-sm font-bold hover:bg-brand-gold-hover transition-all shadow-md shadow-brand-gold/20 disabled:opacity-50"
          >
            <Save className="h-5 w-5" />
            {isSubmitting ? 'Saving Settings...' : 'Save All Settings'}
          </button>
        </div>

      </form>
    </div>
  )
}