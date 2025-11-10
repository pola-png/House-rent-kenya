
import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  endpoint: process.env.WASABI_ENDPOINT,
  accessKeyId: process.env.WASABI_ACCESS_KEY,
  secretAccessKey: process.env.WASABI_SECRET_KEY,
  region: process.env.WASABI_REGION || 'us-east-1',
  s3ForcePathStyle: true,
});

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const propertyId = formData.get('propertyId') as string;
    const propertyTitle = formData.get('propertyTitle') as string;
    const userId = formData.get('userId') as string;
    const userName = formData.get('userName') as string;
    const userEmail = formData.get('userEmail') as string;
    const amount = parseFloat(formData.get('amount') as string);
    const weeks = parseInt(formData.get('weeks') as string);

    if (!file || !propertyId) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const key = `promotions/${userId}/${Date.now()}-${file.name}`;

    await s3.putObject({
      Bucket: process.env.WASABI_BUCKET_NAME!,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    }).promise();

    const screenshotUrl = `${process.env.WASABI_ENDPOINT}/${process.env.WASABI_BUCKET_NAME}/${key}`;

    const { data, error } = await supabase
      .from('payment_requests')
      .insert({
        propertyId,
        propertyTitle: propertyTitle || 'Untitled',
        userId,
        userName,
        userEmail,
        amount,
        paymentScreenshot: screenshotUrl,
        status: 'pending',
        promotionType: `Featured - ${weeks} week${weeks > 1 ? 's' : ''}`,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('API Error:', error);
    return new NextResponse(error.message, { status: 500 });
  }
}
