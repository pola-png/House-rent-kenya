import 'server-only';
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

function getConfig() {
  const region = process.env.WASABI_REGION || process.env.NEXT_PUBLIC_WASABI_REGION || 'us-east-1';
  const endpoint = process.env.WASABI_ENDPOINT || `s3.${region}.wasabisys.com`;
  const bucket = process.env.WASABI_BUCKET_NAME || process.env.NEXT_PUBLIC_WASABI_BUCKET || '';
  const accessKeyId = process.env.WASABI_ACCESS_KEY_ID;
  const secretAccessKey = process.env.WASABI_SECRET_ACCESS_KEY;
  return { region, endpoint, bucket, accessKeyId, secretAccessKey };
}

function createClient() {
  const { region, endpoint, accessKeyId, secretAccessKey } = getConfig();
  if (!accessKeyId || !secretAccessKey) return null;
  return new S3Client({
    region,
    endpoint: `https://${endpoint}`,
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle: false,
  });
}

export const wasabiClient = createClient();

const { endpoint: CFG_ENDPOINT, bucket: CFG_BUCKET } = getConfig();
export const allowedWasabiHosts = new Set<string>([
  CFG_ENDPOINT,
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
  const { endpoint, bucket } = getConfig();
  if (allowedWasabiHosts.has(hostname)) return true;
  if (bucket && hostname === `${bucket}.${endpoint}`) return true;
  if (hostname.endsWith(`.${endpoint}`)) return true;
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
    const { bucket } = getConfig();
    const [maybeBucket, ...rest] = key.split('/');
    if (bucket && maybeBucket === bucket && rest.length) return rest.join('/');
    return key;
  } catch {
    const idx = urlOrKey.indexOf('.com/');
    if (idx !== -1) return urlOrKey.slice(idx + 5);
    return urlOrKey;
  }
}

export async function getPresignedGetUrl(key: string, expiresIn = 900): Promise<string> {
  const client = wasabiClient || createClient();
  const { bucket } = getConfig();
  if (!client || !bucket) throw new Error('Wasabi not configured');
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  return getSignedUrl(client, command, { expiresIn });
}

export interface PutUrlOptions {
  contentType?: string;
  expiresIn?: number;
}

export async function getPresignedPutUrl(key: string, opts: PutUrlOptions = {}): Promise<{ url: string; headers: Record<string, string> }>{
  const { contentType, expiresIn = 300 } = opts;
  const client = wasabiClient || createClient();
  const { bucket } = getConfig();
  if (!client || !bucket) throw new Error('Wasabi not configured');
  const command = new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType });
  const url = await getSignedUrl(client, command, { expiresIn });
  const headers: Record<string, string> = {};
  if (contentType) headers['Content-Type'] = contentType;
  return { url, headers };
}

export function buildPublicishPath(key: string): string {
  const { bucket, endpoint } = getConfig();
  if (!bucket || !endpoint) return key.replace(/^\/+/, '');
  return `https://${bucket}.${endpoint}/${key.replace(/^\/+/, '')}`;
}
