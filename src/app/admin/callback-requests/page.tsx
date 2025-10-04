
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, PhoneCall, User } from "lucide-react";
import { useCollection, useFirestore, useUser, useMemoFirebase, updateDocumentNonBlocking } from "@/firebase";
import { collection, query, where, doc } from "firebase/firestore";
import type { CallbackRequest } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from 'date-fns';

export default function CallbackRequestsPage() {
  const firestore = useFirestore();
  const { user } = useUser();

  const requestsQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, "callback-requests"),
      where("agentId", "==", user.uid),
      where("status", "==", "pending")
    );
  }, [firestore, user]);

  const { data: requests, isLoading } = useCollection<CallbackRequest>(requestsQuery);

  const handleMarkAsContacted = (requestId: string) => {
    if (!firestore) return;
    const requestDocRef = doc(firestore, "callback-requests", requestId);
    updateDocumentNonBlocking(requestDocRef, { status: "contacted" });
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
                    Requested {formatDistanceToNow(request.createdAt.toDate(), { addSuffix: true })}
                   </p>
                </div>
                <Button size="sm" onClick={() => handleMarkAsContacted(request.id)}>
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
