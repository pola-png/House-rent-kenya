'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Mail, Phone } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

export default function RealEstateAgentsPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'agent')
      .order('createdAt', { ascending: false })
      .limit(12);

    if (data) setAgents(data);
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Real Estate Agents Near Me in Kenya</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Connect with verified real estate agents in Kenya. Professional property agents ready to help you find your perfect home or sell your property.
      </p>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-64 w-full" />)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {agents.map((agent) => (
              <Card key={agent.id}>
                <CardContent className="p-6 text-center">
                  <Avatar className="h-24 w-24 mx-auto mb-4">
                    {agent.photoURL && <AvatarImage src={agent.photoURL} />}
                    <AvatarFallback>{agent.displayName?.charAt(0) || 'A'}</AvatarFallback>
                  </Avatar>
                  <h3 className="font-bold text-lg">{agent.displayName}</h3>
                  {agent.agencyName && <p className="text-sm text-muted-foreground">{agent.agencyName}</p>}
                  <div className="mt-4 space-y-2">
                    {agent.email && (
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <a href={`mailto:${agent.email}`}><Mail className="h-4 w-4 mr-2" />Email</a>
                      </Button>
                    )}
                    {agent.phoneNumber && (
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <a href={`tel:${agent.phoneNumber}`}><Phone className="h-4 w-4 mr-2" />Call</a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Button asChild size="lg">
              <Link href="/agents">View All Agents</Link>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
