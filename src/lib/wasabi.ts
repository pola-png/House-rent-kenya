import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

const wasabiClient = new S3Client({
  endpoint: process.env.NEXT_PUBLIC_WASABI_ENDPOINT || 'https://s3.wasabisys.com',
  region: process.env.NEXT_PUBLIC_WASABI_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_WASABI_ACCESS_KEY || '',
    secretAccessKey: process.env.NEXT_PUBLIC_WASABI_SECRET_KEY || '',
  },
  requestHandler: {
    requestTimeout: 30000, // 30 seconds timeout
  },
});

const BUCKET_NAME = process.env.NEXT_PUBLIC_WASABI_BUCKET || 'house-rent-kenya';

export const uploadToWasabi = async (file: File, path: string): Promise<string> => {
  try {
    console.log('Starting Wasabi upload:', { path, fileSize: file.size, fileType: file.type });
    
    // Add timeout wrapper
    const uploadPromise = new Promise<string>(async (resolve, reject) => {
      try {
        const command = new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: path,
          Body: file,
          ContentType: file.type,
          ACL: 'public-read',
        });

        const result = await wasabiClient.send(command);
        console.log('Wasabi upload successful:', result);
        
        const publicUrl = `${process.env.NEXT_PUBLIC_WASABI_ENDPOINT}/${BUCKET_NAME}/${path}`;
        console.log('Generated public URL:', publicUrl);
        
        resolve(publicUrl);
      } catch (error) {
        reject(error);
      }
    });

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Upload timeout after 30 seconds')), 30000);
    });

    return await Promise.race([uploadPromise, timeoutPromise]);
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