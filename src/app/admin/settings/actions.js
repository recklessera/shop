'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function updateStoreSettings(formData) {
  const data = {
    theme_primary_color: formData.get('theme_primary_color'),
    theme_secondary_color: formData.get('theme_secondary_color'),
    theme_accent_color: formData.get('theme_accent_color'),
    homepage_banner_url: formData.get('homepage_banner_url'),
    contact_email: formData.get('contact_email'),
    instagram_url: formData.get('instagram_url'),
    twitter_url: formData.get('twitter_url'),
    tiktok_url: formData.get('tiktok_url'),
    whatsapp_number: formData.get('whatsapp_number'),
  }

  try {
    // Check if a settings row already exists
    const existingSettings = await prisma.storeSettings.findFirst()

    if (existingSettings) {
      // Update existing
      await prisma.storeSettings.update({
        where: { id: existingSettings.id },
        data
      })
    } else {
      // Create the first and only row
      await prisma.storeSettings.create({
        data
      })
    }

    revalidatePath('/admin/settings')
    // We will also want to revalidate the main storefront once it's built
    revalidatePath('/') 
  } catch (error) {
    console.error("Failed to update settings:", error)
    throw new Error('Failed to update store settings.')
  }
}