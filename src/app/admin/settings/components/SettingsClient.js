'use client'

import { useState } from 'react'
import { updateStoreSettings } from '../actions'
import { Save, Image as ImageIcon, Link as LinkIcon, Mail } from 'lucide-react'

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
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-foreground">Store Appearance & Settings</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 flex flex-col">
        
        {/* Appearance & Branding */}
        <div className="bg-background border border-gray-200 p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <ImageIcon className="h-5 w-5 text-gray-500" />
            <h3 className="text-lg font-medium text-foreground">Appearance</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Homepage Banner Image URL</label>
              <input 
                type="url" 
                name="homepage_banner_url" 
                defaultValue={currentSettings.homepage_banner_url || ''} 
                placeholder="https://..."
                className="block w-full border border-gray-300 px-3 py-2 text-sm focus:border-foreground focus:outline-none" 
              />
              <p className="text-xs text-gray-500 mt-1">Provide a high-res Cloudinary or external URL for the main hero image.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-100">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color (Hex)</label>
                <div className="flex items-center gap-2">
                  <input type="color" name="theme_primary_color" defaultValue={currentSettings.theme_primary_color || '#000000'} className="h-8 w-8 cursor-pointer border-0 p-0" />
                  <input type="text" defaultValue={currentSettings.theme_primary_color || '#000000'} className="flex-1 border border-gray-300 px-3 py-2 text-sm focus:border-foreground focus:outline-none uppercase" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Color (Hex)</label>
                <div className="flex items-center gap-2">
                  <input type="color" name="theme_secondary_color" defaultValue={currentSettings.theme_secondary_color || '#ffffff'} className="h-8 w-8 cursor-pointer border-0 p-0" />
                  <input type="text" defaultValue={currentSettings.theme_secondary_color || '#ffffff'} className="flex-1 border border-gray-300 px-3 py-2 text-sm focus:border-foreground focus:outline-none uppercase" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Accent Color (Hex)</label>
                <div className="flex items-center gap-2">
                  <input type="color" name="theme_accent_color" defaultValue={currentSettings.theme_accent_color || '#ef4444'} className="h-8 w-8 cursor-pointer border-0 p-0" />
                  <input type="text" defaultValue={currentSettings.theme_accent_color || '#ef4444'} className="flex-1 border border-gray-300 px-3 py-2 text-sm focus:border-foreground focus:outline-none uppercase" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-background border border-gray-200 p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Mail className="h-5 w-5 text-gray-500" />
            <h3 className="text-lg font-medium text-foreground">Contact Details</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
              <input 
                type="email" 
                name="contact_email" 
                defaultValue={currentSettings.contact_email || ''} 
                placeholder="support@recklessera.com"
                className="block w-full border border-gray-300 px-3 py-2 text-sm focus:border-foreground focus:outline-none" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Business Number</label>
              <input 
                type="text" 
                name="whatsapp_number" 
                defaultValue={currentSettings.whatsapp_number || ''} 
                placeholder="+234..."
                className="block w-full border border-gray-300 px-3 py-2 text-sm focus:border-foreground focus:outline-none" 
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-background border border-gray-200 p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <LinkIcon className="h-5 w-5 text-gray-500" />
            <h3 className="text-lg font-medium text-foreground">Social Links</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
              <input type="url" name="instagram_url" defaultValue={currentSettings.instagram_url || ''} placeholder="https://instagram.com/..." className="block w-full border border-gray-300 px-3 py-2 text-sm focus:border-foreground focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Twitter / X URL</label>
              <input type="url" name="twitter_url" defaultValue={currentSettings.twitter_url || ''} placeholder="https://twitter.com/..." className="block w-full border border-gray-300 px-3 py-2 text-sm focus:border-foreground focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">TikTok URL</label>
              <input type="url" name="tiktok_url" defaultValue={currentSettings.tiktok_url || ''} placeholder="https://tiktok.com/@..." className="block w-full border border-gray-300 px-3 py-2 text-sm focus:border-foreground focus:outline-none" />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-foreground text-background px-8 py-3 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {isSubmitting ? 'Saving Settings...' : 'Save All Settings'}
          </button>
        </div>

      </form>
    </div>
  )
}