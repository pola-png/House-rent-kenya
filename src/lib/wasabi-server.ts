import 'server-only';
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

const isAllowedWasabiHost = (hostname: string): boolean => {
  if (allowedWasabiHosts.has(hostname)) return true;
  if (hostname === `${BUCKET}.${ENDPOINT}`) return true;
  if (hostname.endsWith(`.${ENDPOINT}`)) return true;
  if (hostname.endsWith('.wasabisys.com')) return true;
  return false;
};

export function extractWasabiKey(urlOrKey: string): string {
  if (!/^https?:\/\//i.test(urlOrKey)) return urlOrKey.replace(/^\/+/, '');
  try {
    const u = new URL(urlOrKey);
    if (!isAllowedWasabiHost(u.hostname)) {
      throw new Error(`Disallowed host: ${u.hostname}`);
    }
    const hostParts = u.hostname.split('.');
    let key = u.pathname.replace(/^\//, '');
    if (hostParts.length > 3 && hostParts[0] !== 's3') {
      return key;
    }
    const [maybeBucket, ...rest] = key.split('/');
    if (maybeBucket === BUCKET && rest.length) return rest.join('/');
    return key;
  } catch {
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
  expiresIn?: number;
}

export async function getPresignedPutUrl(key: string, opts: PutUrlOptions = {}): Promise<{ url: string; headers: Record<string, string> }>{
  const { contentType, expiresIn = 300 } = opts;
  const command = new PutObjectCommand({ Bucket: BUCKET, Key: key, ContentType: contentType });
  const url = await getSignedUrl(wasabiClient, command, { expiresIn });
  const headers: Record<string, string> = {};
  if (contentType) headers['Content-Type'] = contentType;
  return { url, headers };
}

export function buildPublicishPath(key: string): string {
  return `https://${BUCKET}.${ENDPOINT}/${key.replace(/^\/+/, '')}`;
}

