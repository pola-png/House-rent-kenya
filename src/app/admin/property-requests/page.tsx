
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Mail, Tag, MapPin, Bed, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { formatDistanceToNow } from 'date-fns';

// Import mock data
import mockPropertyRequests from "@/lib/docs/property-requests.json";

interface PropertyRequest {
    id: string;
    userName: string;
    userEmail: string;
    location: string;
    propertyType: string;
    bedrooms: number;
    budget: number;
    status: 'new' | 'contacted' | 'matched';
    createdAt: Date;
}

export default function PropertyRequestsPage() {
    const [requests, setRequests] = useState<PropertyRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate fetching and transforming data
        const typedRequests: PropertyRequest[] = mockPropertyRequests.map(req => ({
            ...req,
            createdAt: new Date(req.createdAt),
            status: req.status as 'new' | 'contacted' | 'matched'
        }));
        setRequests(typedRequests);
        setIsLoading(false);
    }, []);

    const getStatusBadge = (status: PropertyRequest['status']) => {
        switch (status) {
            case 'new':
                return <Badge variant="default">New</Badge>;
            case 'contacted':
                return <Badge variant="secondary">Contacted</Badge>;
            case 'matched':
                return <Badge className="bg-green-100 text-green-800">Matched</Badge>;
        }
    }


  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-6 w-6" />
          Property Requests
        </CardTitle>
        <CardDescription>
          Track requests from users looking for specific types of properties.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
            </div>
        ) : requests.length > 0 ? (
            <div className="space-y-4">
                {requests.map(request => (
                    <div key={request.id} className="rounded-lg border p-4">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-2">
                            <div>
                                <p className="font-bold text-lg">{request.userName}</p>
                                <a href={`mailto:${request.userEmail}`} className="text-sm text-primary hover:underline flex items-center gap-1">
                                    <Mail className="h-3 w-3"/>
                                    {request.userEmail}
                                </a>
                            </div>
                           {getStatusBadge(request.status)}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm border-y py-3">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground"/>
                                <div>
                                    <p className="text-xs text-muted-foreground">Location</p>
                                    <p className="font-semibold">{request.location}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Tag className="h-4 w-4 text-muted-foreground"/>
                                <div>
                                    <p className="text-xs text-muted-foreground">Type</p>
                                    <p className="font-semibold">{request.propertyType}</p>
                                </div>
                            </div>
                             <div className="flex items-center gap-2">
                                <Bed className="h-4 w-4 text-muted-foreground"/>
                                <div>
                                    <p className="text-xs text-muted-foreground">Bedrooms</p>
                                    <p className="font-semibold">{request.bedrooms}+</p>
                                </div>
                            </div>
                             <div className="flex items-center gap-2">
                                <Handshake className="h-4 w-4 text-muted-foreground"/>
                                <div>
                                    <p className="text-xs text-muted-foreground">Budget</p>
                                    <p className="font-semibold">Ksh {request.budget.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                         <div className="flex flex-col sm:flex-row justify-between sm:items-center mt-3 gap-2">
                            <p className="text-xs text-muted-foreground">
                                Received {formatDistanceToNow(request.createdAt, { addSuffix: true })}
                            </p>
                             <Button size="sm">Find Matches</Button>
                         </div>
                    </div>
                ))}
            </div>
        ) : (
             <div className="text-center py-12 text-muted-foreground">
                <Heart className="h-12 w-12 mx-auto mb-4" />
                <p className="font-semibold">No property requests found.</p>
                <p className="text-sm">Requests from potential clients will appear here.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
