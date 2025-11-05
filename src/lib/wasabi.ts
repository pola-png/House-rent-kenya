import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

const wasabiClient = new S3Client({
  endpoint: process.env.NEXT_PUBLIC_WASABI_ENDPOINT || 'https://s3.wasabisys.com',
  region: process.env.NEXT_PUBLIC_WASABI_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_WASABI_ACCESS_KEY || '',
    secretAccessKey: process.env.NEXT_PUBLIC_WASABI_SECRET_KEY || '',
  },
});

const BUCKET_NAME = process.env.NEXT_PUBLIC_WASABI_BUCKET || 'house-rent-kenya';

export const uploadToWasabi = async (file: File, path: string): Promise<string> => {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: path,
    Body: file,
    ContentType: file.type,
    ACL: 'public-read',
  });

  await wasabiClient.send(command);
  return `${process.env.NEXT_PUBLIC_WASABI_ENDPOINT}/${BUCKET_NAME}/${path}`;
};

export const deleteFromWasabi = async (path: string): Promise<void> => {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: path,
  });

  await wasabiClient.send(command);
};