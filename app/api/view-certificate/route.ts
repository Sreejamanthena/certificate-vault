import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function GET(
  req: NextRequest
) {
  try {
    const publicId =
      req.nextUrl.searchParams.get(
        'publicId'
      );

    if (!publicId) {
      return NextResponse.json(
        {
          error: 'Missing publicId',
        },
        { status: 400 }
      );
    }

    const result =
      await cloudinary.search
        .expression(
          `public_id="${publicId}"`
        )
        .execute();

    if (
      !result.resources ||
      result.resources.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            'Certificate not found',
        },
        { status: 404 }
      );
    }

    const resource =
      result.resources[0];

    console.log(
      'RESOURCE:',
      resource.resource_type
    );
    console.log(
      'TYPE:',
      resource.type
    );
    console.log(
      'FORMAT:',
      resource.format
    );

    const signedUrl =
      cloudinary.utils.private_download_url(
        publicId,
        resource.format,
        {
          resource_type:
            resource.resource_type,
          type: 'private',
          expires_at:
            Math.floor(
              Date.now() / 1000
            ) + 300,
        }
      );

    let thumbnailUrl = '';

    if (resource.format === 'pdf') {
      thumbnailUrl =
        cloudinary.url(publicId, {
          resource_type: 'image',
          format: 'jpg',
          page: '1',
          width: 400,
          crop: 'fill',
          sign_url: true,
          secure: true,
          type: 'private',
        });
    } else {
      thumbnailUrl =
        cloudinary.url(publicId, {
          resource_type: 'image',
          sign_url: true,
          secure: true,
          type: 'private',
        });
    }

    console.log(
      'THUMBNAIL URL:',
      thumbnailUrl
    );

    return NextResponse.json({
      url: signedUrl,
      thumbnailUrl,
    });
  } catch (error) {
    console.error(
      'VIEW CERTIFICATE ERROR:',
      error
    );

    return NextResponse.json(
      {
        error:
          'Failed to generate URL',
      },
      { status: 500 }
    );
  }
}