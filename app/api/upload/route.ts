import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(req: Request) {
  try {
    // the req is an obj conatinf the method,api,body etcc.. from that we acquire the body using the req.formdata()
    // Get form data 
    const formData = await req.formData();

    // Get uploaded file
    // this contains the file obj such as the filename type ,size binary data etc....
    const file = formData.get('file') as File;

    // Validation 
    // here if no file is uploaded then the file obj is null that indicates false 
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Convert file to buffer here we extract the binary data to the browser buffer 
    const bytes = await file.arrayBuffer();
    // clloudinary reqiures either stream or buffer so we will convert the binary data to buffer using the buffer.from() method
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    // creats an strem to store the data to the cloudinary 
    const result: any = await new Promise(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: 'auto', // Supports PDFs + Images
              folder: 'certvault',
              type: 'private', // Secure storage
            },
            //callback executed by the clodinary after the upload is completed it has two 
            //parameters error and result if any error occured it will be stored in the error parameter 
            // and if the upload is successful then the result will be stored in the result parameter containg the secure url and the pub id and the other data
            (error, result) => {
              if (error) {
                reject(error); // if any error occured than passes the flow to the catch block 
              } else {
                resolve(result); // sucess stores the response in the resullt 
              }
            }
          )
          .end(buffer); // this passes the data through the stream 
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
