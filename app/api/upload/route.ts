import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(req: Request) {
  try {
    // Get form data
    const formData = await req.formData();

    // Get uploaded file
    const file = formData.get('file') as File;

    // Validation
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result: any = await new Promise(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: 'auto', // Supports PDFs + Images
              folder: 'certvault',
              type: 'private', // Secure storage
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          )
          .end(buffer);
      }
    );

    // Return only required data
    return NextResponse.json({
      success: true,

      public_id: result.public_id,

      asset_id: result.asset_id,

      secure_url: result.secure_url,

      resource_type: result.resource_type,

      original_filename:
        result.original_filename,
    });
  } catch (error) {
    console.error(
      'Cloudinary Upload Error:',
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: 'Upload failed',
      },
      { status: 500 }
    );
  }
}