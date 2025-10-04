
"use client";
import { collection, query, where } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building, Mail, Phone, User, Users } from "lucide-react";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import type { UserProfile } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function AgentsPage() {
  const firestore = useFirestore();
  const agentsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "users"), where("role", "==", "agent"));
  }, [firestore]);

  const { data: agents, isLoading } = useCollection<UserProfile>(agentsQuery);

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <Users className="h-12 w-12 mx-auto text-primary mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold font-headline">Find an Agent</h1>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            Connect with professional and verified real estate agents across Kenya.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="items-center text-center">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <Skeleton className="h-6 w-40 mt-4" />
                    <Skeleton className="h-4 w-32" />
                </CardHeader>
                <CardContent className="text-center space-y-4">
                    <Skeleton className="h-5 w-48 mx-auto" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {agents?.map((agent) => (
              <Card key={agent.id} className="flex flex-col">
                <CardHeader className="items-center text-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={agent.photoURL} alt={agent.displayName} />
                    <AvatarFallback>
                      <User />
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="font-headline text-2xl">{agent.displayName}</CardTitle>
                  <p className="text-muted-foreground">{agent.agencyName || 'Independent Agent'}</p>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-between text-center space-y-4">
                   <div className="flex items-center justify-center text-muted-foreground">
                        <Building className="h-4 w-4 mr-2" />
                        <span>{agent.agencyName || 'No Agency Info'}</span>
                   </div>
                  <div className="space-y-2">
                     <Button asChild className="w-full">
                        <a href={`tel:${agent.phoneNumber}`}>
                          <Phone className="h-4 w-4 mr-2" /> Call Agent
                        </a>
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                        <a href={`mailto:${agent.email}`}>
                          <Mail className="h-4 w-4 mr-2" /> Email Agent
                        </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
