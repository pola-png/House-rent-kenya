
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { propertyId, propertyTitle, weeks, screenshotUrl } = await request.json();

    if (!propertyId || !weeks || !screenshotUrl) {
      return new NextResponse(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const weeklyRate = 5;
    const amount = weeks * weeklyRate;

    const { data, error } = await supabase
      .from('payment_requests')
      .insert({
        property_id: propertyId,
        property_title: propertyTitle || 'Untitled',
        user_id: user.id,
        user_name: user.user_metadata?.full_name || user.email,
        user_email: user.email,
        amount: amount,
        payment_screenshot_url: screenshotUrl,
        status: 'pending',
        type: 'promotion',
        details: `Featured - ${weeks} week${weeks > 1 ? 's' : ''}`,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      throw error;
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('API Error:', error);
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
