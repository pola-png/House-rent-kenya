
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users2, Mail, Phone, PlusCircle, User } from "lucide-react";
import type { UserProfile } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from 'react';
// Mock data
import usersData from "@/lib/docs/users.json";

export default function MyTeamPage() {
  const [agents, setAgents] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching agents from mock data
    const agentUsers = usersData.filter(user => user.role === 'agent').map(a => ({...a, uid: String(a.uid), createdAt: new Date(a.createdAt), role: a.role as "user" | "agent" | "admin"}));
    setAgents(agentUsers);
    setIsLoading(false);
  }, []);


  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
            <Users2 className="h-6 w-6" />
            My Team
          </h1>
          <p className="text-muted-foreground">
            Manage your team members and their roles.
          </p>
        </div>
        <Button size="sm">
          <PlusCircle className="h-4 w-4 mr-2" />
          Invite New Member
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            The following agents are part of your team.
          </CardDescription>
        </CardHeader>
        <CardContent>
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
                </div>
            ) : agents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {agents.map(agent => (
                        <div key={agent.uid} className="flex items-center gap-4 rounded-lg border p-4">
                            <Avatar className="h-12 w-12">
                                {agent.photoURL && <AvatarImage src={agent.photoURL} alt={agent.displayName} />}
                                <AvatarFallback>
                                {agent.displayName?.charAt(0) || <User />}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-grow">
                                <p className="font-semibold">{agent.displayName}</p>
                                <p className="text-sm text-muted-foreground">{agent.agencyName}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                    <Mail className="h-3 w-3"/>
                                    <span>{agent.email}</span>
                                </div>
                            </div>
                             <Button variant="outline" size="sm">View</Button>
                        </div>
                    ))}
                </div>
            ) : (
                 <div className="text-center py-12 text-muted-foreground">
                    <Users2 className="h-12 w-12 mx-auto mb-4" />
                    <p className="font-semibold">No team members found.</p>
                    <p className="text-sm">Invite members to build your team.</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
