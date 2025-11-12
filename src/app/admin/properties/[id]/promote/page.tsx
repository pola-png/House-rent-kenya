'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth-supabase';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function PromotePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  const propertyIdParam = searchParams?.get('propertyId') || null;

  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(!!propertyIdParam);
  const [promotionWeeks, setPromotionWeeks] = useState(1);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const weeklyRate = 5;

  useEffect(() => {
    if (propertyIdParam && user) {
      fetchProperty();
    }
  }, [propertyIdParam, user]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyIdParam)
        .eq('landlord_id', user?.uid)
        .single();

      if (error) throw error;
      setProperty(data);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Property not found' });
    } finally {
      setLoading(false);
    }
  };



  const handleSubmit = async () => {
    if (!user || !property) {
      toast({ variant: "destructive", title: "Error", description: "Missing required data" });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const promotionType = `Featured - ${promotionWeeks} week${promotionWeeks > 1 ? 's' : ''}`;
      const totalAmount = promotionWeeks * weeklyRate;

      // Save promotion request to database
      const { error } = await supabase
        .from('payment_requests')
        .insert({
          "propertyId": property.id,
          "propertyTitle": property.title || 'Untitled',
          "userId": user.uid,
          "userName": user.displayName || user.email,
          "userEmail": user.email,
          amount: totalAmount,
          status: 'pending',
          "promotionType": promotionType,
        });

      if (error) throw error;

      // Create WhatsApp message
      const adminPhone = "+254706060684";
      const message = `🏠 *PROPERTY PROMOTION REQUEST*\n\n` +
        `📋 *Property Details:*\n` +
        `• Title: ${property.title}\n` +
        `• Location: ${property.location}, ${property.city}\n\n` +
        `💰 *Promotion Details:*\n` +
        `• Type: ${promotionType}\n` +
        `• Amount: $${totalAmount}\n\n` +
        `👤 *User Details:*\n` +
        `• Name: ${user.displayName || user.email}\n` +
        `• Email: ${user.email}\n\n` +
        `📱 *Next Steps:*\n` +
        `Please send your payment screenshot here after making the payment.\n\n` +
        `Thank you! 🙏`;

      const whatsappUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;
      
      // Open WhatsApp
      window.open(whatsappUrl, '_blank');
      
      toast({ title: "Success!", description: "Promotion request submitted. WhatsApp opened for payment." });
      router.push('/admin/promotions');
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message || 'Failed to submit' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      <Button variant="ghost" asChild>
        <Link href="/admin/properties">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Properties
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Promote Property</CardTitle>
          <CardDescription>Boost your property visibility with featured placement</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {propertyIdParam && loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : property ? (
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">{property.title}</h3>
              <p className="text-sm text-muted-foreground">
                {property.location}, {property.city}
              </p>
            </div>
          ) : propertyIdParam ? (
            <div className="p-4 bg-red-100 rounded-lg">
              <p className="text-sm">Property not found</p>
            </div>
          ) : null}

          <div>
            <Label htmlFor="weeks">Number of Weeks</Label>
            <div className="flex items-center space-x-4 mt-2">
              <Input
                type="range"
                id="weeks"
                min="1"
                max="12"
                value={promotionWeeks}
                onChange={(e) => setPromotionWeeks(parseInt(e.target.value))}
                className="w-full"
              />
              <span className="text-lg font-semibold w-10">{promotionWeeks}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              ${weeklyRate} per week • Total: ${(promotionWeeks * weeklyRate).toFixed(2)}
            </p>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">Payment Process</h4>
            <p className="text-sm text-blue-700">
              After submitting, you'll be redirected to WhatsApp to contact our admin. 
              Please make your payment and send the screenshot via WhatsApp for quick approval.
            </p>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!property || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <MessageCircle className="mr-2 h-4 w-4" />
                Submit & Contact Admin
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}