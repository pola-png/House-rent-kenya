'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, PhoneCall, User } from "lucide-react";
import type { CallbackRequest } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from 'date-fns';
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth-supabase";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export default function CallbackRequestsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [requests, setRequests] = useState<CallbackRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchRequests();
    }
  }, [user]);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('callback_requests')
        .select(`
          *,
          properties:propertyId (title)
        `)
        .eq('agentId', user?.uid)
        .eq('status', 'pending')
        .order('createdAt', { ascending: false });

      if (error) throw error;

      const typedRequests: CallbackRequest[] = (data || []).map(r => ({
        id: r.id,
        propertyId: r.propertyId,
        propertyTitle: r.properties?.title || 'Unknown Property',
        userName: r.userName,
        userPhone: r.userPhone,
        agentId: r.agentId,
        status: r.status as "pending" | "contacted",
        createdAt: new Date(r.createdAt)
      }));

      setRequests(typedRequests);
    } catch (error) {
      console.error('Error fetching callback requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsContacted = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('callback_requests')
        .update({ status: 'contacted' })
        .eq('id', requestId);

      if (error) throw error;

      setRequests(prev => prev.filter(req => req.id !== requestId));
      toast({
        title: 'Marked as Contacted',
        description: 'Request has been marked as contacted.'
      });
    } catch (error) {
      console.error('Error updating request:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not update request status.'
      });
    }
  };



  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PhoneCall className="h-6 w-6" />
          Callback Requests
        </CardTitle>
        <CardDescription>
          These are potential clients who have requested a callback for one of your properties.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
          </div>
        ) : requests && requests.length > 0 ? (
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request.id} className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-1">
                  <p className="font-semibold text-lg">{request.userName}</p>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <User className="h-4 w-4" /> {request.userPhone}
                  </p>
                  <p className="text-sm text-muted-foreground italic">
                    Interested in: {request.propertyTitle}
                  </p>
                   <p className="text-xs text-muted-foreground">
                    Requested {formatDistanceToNow(request.createdAt, { addSuffix: true })}
                   </p>
                </div>
                <Button size="sm" onClick={() => handleMarkAsContacted(String(request.id))}>
                  <Check className="mr-2 h-4 w-4" />
                  Mark as Contacted
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <PhoneCall className="h-12 w-12 mx-auto mb-4" />
            <p className="font-semibold">No pending callback requests.</p>
            <p className="text-sm">New requests from potential clients will appear here.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
