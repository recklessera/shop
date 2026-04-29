'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { v2 as cloudinary } from 'cloudinary'
import { createClient } from '@/utils/supabase/server'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function createBlog(formData) {
  // Securely get the currently logged-in admin's ID
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error("You must be logged in to publish a post.")

  const title = formData.get('title')
  const slug = formData.get('slug').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  const content = formData.get('content')
  const status = formData.get('is_published') === 'on' ? 'published' : 'draft'
  const imageFile = formData.get('image')

  let featured_image_url = null

  // Process the Cloudinary upload if an image was provided
  if (imageFile && imageFile.size > 0) {
    const arrayBuffer = await imageFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64Data = buffer.toString('base64')
    const fileUri = `data:${imageFile.type};base64,${base64Data}`

    const uploadResponse = await cloudinary.uploader.upload(fileUri, {
      folder: 'reckless_era/blog', 
    })
    featured_image_url = uploadResponse.secure_url
  }

  try {
    await prisma.blog.create({
      data: {
        title,
        slug,
        content,
        featured_image_url,
        status,
        published_at: status === 'published' ? new Date() : null,
        author_id: user.id // Links directly to the User table
      }
    })
    revalidatePath('/admin/blog')
  } catch (error) {
    console.error("Failed to create blog post:", error)
    throw new Error('Failed to publish post. Ensure the slug is unique.')
  }
}

export async function toggleBlogStatus(formData) {
  const id = formData.get('id')
  const currentStatus = formData.get('status')
  
  const newStatus = currentStatus === 'published' ? 'draft' : 'published'
  
  await prisma.blog.update({
    where: { id },
    data: { 
      status: newStatus,
      // Update the timestamp so it jumps to the top of the feed if newly published
      published_at: newStatus === 'published' ? new Date() : null
    }
  })
  revalidatePath('/admin/blog')
}

export async function deleteBlog(formData) {
  const id = formData.get('id')
  await prisma.blog.delete({ where: { id } })
  revalidatePath('/admin/blog')
}