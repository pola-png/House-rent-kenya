
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
  const propertyId = searchParams?.get('propertyId') || '';
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(!!propertyId);
  const [promotionWeeks, setPromotionWeeks] = useState(1);
  const [propertyIdInput, setPropertyIdInput] = useState('');
  const [propertyTitle, setPropertyTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const weeklyRate = 5;

  useEffect(() => {
    if (propertyId && user) {
      fetchProperty();
    } else {
      setLoading(false);
    }
  }, [propertyId, user]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .eq('landlordId', user?.uid)
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
    if (!user) {
      toast({ variant: "destructive", title: "Error", description: "You must be logged in" });
      return;
    }

    const finalPropertyId = propertyId || propertyIdInput.trim();
    const finalPropertyTitle = property?.title || propertyTitle.trim() || 'Untitled';

    if (!finalPropertyId) {
      toast({ variant: "destructive", title: "Missing Property ID", description: "Please provide a property ID" });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const promotionType = `Featured - ${promotionWeeks} week${promotionWeeks > 1 ? 's' : ''}`;
      const totalAmount = promotionWeeks * weeklyRate;

      const { error } = await supabase
        .from('payment_requests')
        .insert([{
          propertyId: finalPropertyId,
          propertyTitle: finalPropertyTitle,
          userId: user.uid,
          userName: user.displayName || user.email,
          userEmail: user.email,
          amount: totalAmount,
          status: 'pending',
          promotionType: promotionType,
        }]);

      if (error) throw error;

      const adminPhone = "+254706060684";
      const message = `🏠 *PROPERTY PROMOTION REQUEST*\n\n` +
        `📋 *Property Details:*\n` +
        `• Title: ${finalPropertyTitle}\n` +
        `• Property ID: ${finalPropertyId}\n\n` +
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
      
      window.open(whatsappUrl, '_blank');
      
      toast({ title: "Success!", description: "Promotion request submitted. WhatsApp opened for payment screenshot." });
      router.push('/admin/properties');
    } catch (error: any) {
      toast({ variant: "destructive", title: "Submission Failed", description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl space-y-6">
      <Button variant="ghost" asChild>
        <Link href="/admin/properties">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Properties
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Promote Property</CardTitle>
          <CardDescription>Boost your property's visibility with featured placement</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : property ? (
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">{property.title}</h3>
              <p className="text-sm text-muted-foreground">{property.location}, {property.city}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="propertyId">Property ID *</Label>
                <Input
                  id="propertyId"
                  value={propertyIdInput}
                  onChange={(e) => setPropertyIdInput(e.target.value)}
                  placeholder="Enter property ID"
                />
              </div>
              <div>
                <Label htmlFor="propertyTitle">Property Title</Label>
                <Input
                  id="propertyTitle"
                  value={propertyTitle}
                  onChange={(e) => setPropertyTitle(e.target.value)}
                  placeholder="Enter property title"
                />
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="weeks">Number of Weeks</Label>
            <Input
              id="weeks"
              type="number"
              min="1"
              max="52"
              value={promotionWeeks}
              onChange={(e) => setPromotionWeeks(Math.max(1, parseInt(e.target.value) || 1))}
              className="mt-2"
            />
          </div>

          <div className="p-4 bg-primary/10 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total Amount</span>
              <span className="text-2xl font-bold">${(promotionWeeks * weeklyRate).toLocaleString()}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">${weeklyRate} per week</p>
          </div>

          <div className="space-y-4 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold">Payment Instructions</h4>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Payment via M-Pesa</span></p>
              <p><span className="font-medium">Send Money to:</span> +254706060684</p>
              <p><span className="font-medium">Name:</span> House Rent Kenya</p>
              <p><span className="font-medium">Amount:</span> ${(promotionWeeks * weeklyRate).toLocaleString()}</p>
            </div>
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
            disabled={isSubmitting}
            className="w-full"
            size="lg"
          >
            {isSubmitting ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Submitting...</>
            ) : (
              <><MessageCircle className="h-4 w-4 mr-2" />Submit & Contact Admin</>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
