import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  endpoint: 'https://s3.us-east-1.wasabisys.com',
  accessKeyId: process.env.NEXT_PUBLIC_WASABI_ACCESS_KEY,
  secretAccessKey: process.env.NEXT_PUBLIC_WASABI_SECRET_KEY,
  region: 'us-east-1',
  signatureVersion: 'v4'
});

export default async function handler(req, res) {
  const { fileName, fileType } = req.query;

  const params = {
    Bucket: process.env.NEXT_PUBLIC_WASABI_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType
  };

  try {
    const uploadURL = await s3.getSignedUrlPromise('putObject', params);
    res.status(200).json({ uploadURL });
  } catch (error) {
    console.error('Error generating signed URL:', error);
    res.status(500).json({ error: 'Failed to generate upload URL' });
  }
}