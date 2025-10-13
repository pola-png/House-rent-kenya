
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Mail, Phone, Star, User } from "lucide-react";
import { CallbackRequest } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from 'date-fns';
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth-supabase";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export default function LeadsPage() {
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
      console.error('Error fetching leads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (requestId: string, status: "pending" | "contacted") => {
    try {
      const { error } = await supabase
        .from('callback_requests')
        .update({ status })
        .eq('id', requestId);

      if (error) throw error;

      setRequests(prev => prev.map(req => 
        req.id === requestId ? { ...req, status } : req
      ));
      toast({
        title: 'Status Updated',
        description: `Lead marked as ${status}.`
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not update lead status.'
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-6 w-6" />
          Customer Leads
        </CardTitle>
        <CardDescription>
          Potential clients who have shown interest in your properties.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}
          </div>
        ) : requests && requests.length > 0 ? (
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-lg border p-4 gap-4">
                <div className="space-y-1 flex-grow">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-lg">{request.userName}</p>
                     <Badge variant={request.status === 'pending' ? 'default' : 'secondary'}>{request.status}</Badge>
                  </div>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Phone className="h-4 w-4" /> {request.userPhone}
                  </p>
                  <p className="text-sm text-muted-foreground italic">
                    Interested in: {request.propertyTitle}
                  </p>
                   <p className="text-xs text-muted-foreground">
                    Requested {formatDistanceToNow(request.createdAt, { addSuffix: true })}
                   </p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <Button size="sm" variant="outline" className="w-full sm:w-auto" asChild>
                        <a href={`mailto:${request.userName.replace(' ', '.').toLowerCase()}@example.com`}>
                            <Mail className="mr-2 h-4 w-4" /> Email
                        </a>
                    </Button>
                    <Button 
                        size="sm" 
                        className="w-full sm:w-auto"
                        onClick={() => handleStatusChange(String(request.id), request.status === 'pending' ? 'contacted' : 'pending')}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      {request.status === 'pending' ? 'Mark Contacted' : 'Mark Pending'}
                    </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Star className="h-12 w-12 mx-auto mb-4" />
            <p className="font-semibold">No leads found.</p>
            <p className="text-sm">Leads from potential clients will appear here.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
