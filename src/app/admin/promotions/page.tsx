"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth-supabase";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Clock, CheckCircle, XCircle, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PromotionRequest {
  id: string;
  propertyId: string;
  propertyTitle: string;
  amount: number;
  paymentScreenshot: string;
  status: string;
  promotionType: string;
  createdAt: string;
  approvedAt?: string;
}

export default function PromotionsPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<PromotionRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPromotionRequests();
    }
  }, [user]);

  const fetchPromotionRequests = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('payment_requests')
        .select('*')
        .eq('userId', user.uid)
        .order('createdAt', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching promotion requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Promotion Requests</h1>
        <p className="text-muted-foreground">Track the status of your property promotion requests</p>
      </div>

      {requests.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No promotion requests yet</p>
            <Link href="/admin/properties">
              <Button>Go to My Properties</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {requests.map((request) => (
            <Card key={request.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl">{request.propertyTitle}</CardTitle>
                    <CardDescription>{request.promotionType}</CardDescription>
                  </div>
                  {getStatusBadge(request.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Amount Paid</p>
                    <p className="font-semibold">${request.amount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Submitted</p>
                    <p className="font-semibold">{new Date(request.createdAt).toLocaleDateString()}</p>
                  </div>
                  {request.approvedAt && (
                    <div>
                      <p className="text-sm text-muted-foreground">Approved</p>
                      <p className="font-semibold">{new Date(request.approvedAt).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Payment Screenshot</p>
                  <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                    <Image
                      src={request.paymentScreenshot}
                      alt="Payment Screenshot"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>

                <Link href={`/property/${request.propertyId}`}>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View Property
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
