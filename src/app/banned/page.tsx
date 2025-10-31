'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Ban, Mail, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function BannedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-red-100 rounded-full w-fit">
            <Ban className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-600">Account Suspended</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            Your account has been suspended due to a violation of our terms of service.
          </p>
          <p className="text-sm text-gray-500">
            If you believe this is a mistake or would like to appeal this decision, please contact our support team.
          </p>
          <div className="space-y-3 pt-4">
            <Button asChild className="w-full">
              <Link href="mailto:support@houserentkenya.com">
                <Mail className="h-4 w-4 mr-2" />
                Email Support
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/contact">
                <MessageCircle className="h-4 w-4 mr-2" />
                Contact Form
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}