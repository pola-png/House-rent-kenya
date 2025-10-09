
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Mail, Phone, Star, User } from "lucide-react";
import type { CallbackRequest } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from 'date-fns';
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
// Mock data - in a real app, this would come from a database
import mockRequests from "@/lib/docs/callback-requests.json";

export default function LeadsPage() {
  const [requests, setRequests] = useState<CallbackRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Use mock data
    setRequests(
      mockRequests.map(r => ({...r, id: String(r.id), createdAt: new Date(r.createdAt)}))
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    );
    setIsLoading(false);
  }, []);

  const handleStatusChange = (requestId: string, status: "pending" | "contacted") => {
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status } : req
    ));
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
