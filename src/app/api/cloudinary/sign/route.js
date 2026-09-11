import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export async function POST(request) {
  try {
    const body = await request.json()

    const folder =
      body.folder || 'reckless-era/products'

    const timestamp = Math.round(
      new Date().getTime() / 1000
    )

    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder
      },
      process.env.CLOUDINARY_API_SECRET
    )

    return Response.json({
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      timestamp,
      signature,
      folder
    })
  } catch (error) {
    console.error(
      'Cloudinary signing error:',
      error
    )

    return Response.json(
      {
        error: 'Failed to prepare Cloudinary upload.'
      },
      {
        status: 500
      }
    )
  }
}