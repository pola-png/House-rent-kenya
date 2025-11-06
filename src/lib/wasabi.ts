import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const required = (name: string, value: string | undefined) => {
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
};

const REGION = required('WASABI_REGION', process.env.WASABI_REGION);
const ENDPOINT = required('WASABI_ENDPOINT', process.env.WASABI_ENDPOINT);
const BUCKET = required('WASABI_BUCKET_NAME', process.env.WASABI_BUCKET_NAME);

export const wasabiClient = new S3Client({
  region: REGION,
  endpoint: `https://${ENDPOINT}`,
  credentials: {
    accessKeyId: required('WASABI_ACCESS_KEY_ID', process.env.WASABI_ACCESS_KEY_ID),
    secretAccessKey: required('WASABI_SECRET_ACCESS_KEY', process.env.WASABI_SECRET_ACCESS_KEY),
  },
  forcePathStyle: false,
});

export const allowedWasabiHosts = new Set<string>([
  ENDPOINT,
  // Common regional forms; expand if needed for your account
  's3.wasabisys.com',
  's3.us-east-1.wasabisys.com',
  's3.us-east-2.wasabisys.com',
  's3.us-central-1.wasabisys.com',
  's3.eu-central-1.wasabisys.com',
  's3.eu-west-1.wasabisys.com',
  's3.ca-central-1.wasabisys.com',
  's3.ap-northeast-1.wasabisys.com',
  's3.ap-southeast-1.wasabisys.com',
]);

export function extractWasabiKey(urlOrKey: string): string {
  // If the caller already passed a key, return as-is
  if (!/^https?:\/\//i.test(urlOrKey)) return urlOrKey.replace(/^\/+/, '');

  try {
    const u = new URL(urlOrKey);
    if (!allowedWasabiHosts.has(u.hostname)) {
      throw new Error(`Disallowed host: ${u.hostname}`);
    }
    // Handle both virtual-hosted–style and path-style URLs
    // Virtual hosted: https://<bucket>.<endpoint>/<key>
    // Path style: https://<endpoint>/<bucket>/<key>
    const hostParts = u.hostname.split('.');
    let key = u.pathname.replace(/^\//, '');
    if (hostParts.length > 3 && hostParts[0] !== 's3') {
      // likely <bucket>.<rest>
      // pathname is already the key
      return key;
    }
    // path-style: first segment is bucket
    const [maybeBucket, ...rest] = key.split('/');
    if (maybeBucket === BUCKET && rest.length) return rest.join('/');
    return key;
  } catch {
    // Fallback: attempt the common split used earlier, but safely
    const idx = urlOrKey.indexOf('.com/');
    if (idx !== -1) return urlOrKey.slice(idx + 5);
    return urlOrKey;
  }
}

export async function getPresignedGetUrl(key: string, expiresIn = 900): Promise<string> {
  const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
  return getSignedUrl(wasabiClient, command, { expiresIn });
}

export interface PutUrlOptions {
  contentType?: string;
  expiresIn?: number; // seconds
  aclPrivate?: boolean; // placeholder; Wasabi ignores ACL when bucket is private
}

export async function getPresignedPutUrl(key: string, opts: PutUrlOptions = {}): Promise<{ url: string; headers: Record<string, string> }>{
  const { contentType, expiresIn = 300 } = opts;
  const command = new PutObjectCommand({ Bucket: BUCKET, Key: key, ContentType: contentType });
  const url = await getSignedUrl(wasabiClient, command, { expiresIn });
  // S3 PUT usually needs Content-Type echoed, keep headers explicit for client
  const headers: Record<string, string> = {};
  if (contentType) headers['Content-Type'] = contentType;
  return { url, headers };
}

export function buildPublicishPath(key: string): string {
  // Non-signed canonical path (useful to store in DB); will be converted to presigned on read
  return `https://${BUCKET}.${ENDPOINT}/${key.replace(/^\/+/, '')}`;
}

// Backwards-compatible helper for client forms that previously imported uploadToWasabi
// This performs the standard two-step flow via our API route.
export async function uploadToWasabi(file: File, params: { key: string; contentType?: string }): Promise<{ objectPath: string }>{
  const body = {
    key: params.key,
    contentType: params.contentType || file.type,
    contentLength: file.size,
  };
  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Failed to create upload URL (${res.status})`);
  }
  const { uploadUrl, uploadHeaders, objectPath } = await res.json();

  const put = await fetch(uploadUrl, {
    method: 'PUT',
    headers: uploadHeaders || {},
    body: file,
  });
  if (!put.ok) {
    throw new Error(`Upload failed (${put.status})`);
  }
  return { objectPath };
}
