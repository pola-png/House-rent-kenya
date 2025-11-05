import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

const wasabiClient = new S3Client({
  endpoint: process.env.NEXT_PUBLIC_WASABI_ENDPOINT || 'https://s3.wasabisys.com',
  region: process.env.NEXT_PUBLIC_WASABI_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_WASABI_ACCESS_KEY || '',
    secretAccessKey: process.env.NEXT_PUBLIC_WASABI_SECRET_KEY || '',
  },
  forcePathStyle: true,
});

const BUCKET_NAME = process.env.NEXT_PUBLIC_WASABI_BUCKET || 'house-rent-kenya';

export const uploadToWasabi = async (file: File, path: string): Promise<string> => {
  try {
    console.log('Starting Wasabi upload:', { path, fileSize: file.size, fileType: file.type });
    
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: path,
      Body: file,
      ContentType: file.type,
      Metadata: {
        'Content-Type': file.type,
      },
    });

    const result = await wasabiClient.send(command);
    console.log('Wasabi upload successful:', result);
    
    const publicUrl = `https://s3.wasabisys.com/${BUCKET_NAME}/${path}`;
    console.log('Generated public URL:', publicUrl);
    
    return publicUrl;
  } catch (error: any) {
    console.error('Wasabi upload failed:', error);
    throw new Error(`Wasabi upload failed: ${error.message || 'Unknown error'}`);
  }
};

export const deleteFromWasabi = async (path: string): Promise<void> => {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: path,
  });

  await wasabiClient.send(command);
};