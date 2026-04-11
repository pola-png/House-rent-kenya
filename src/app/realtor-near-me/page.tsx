import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Realtor Near Me Kenya | Find Local Property Agents',
  description: 'Find trusted realtors near you in Kenya. Connect with local property agents for buying, selling & renting real estate.',
  keywords: 'realtor near me Kenya, local realtor Kenya, property agent near me, real estate agent Kenya',
};

async function getAgents() {
  const { data } = await supabase.from('profiles').select('*').eq('role', 'agent').order('createdAt', { ascending: false }).limit(12);
  if (!data) return [];
  return data.map(agent => ({
    ...agent,
    createdAt: new Date(agent.createdAt)
  }));
}

export default async function Page() {
  const agents = await getAgents();
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Realtor Near Me - Find Local Property Experts</h1>
      <p className="text-lg text-muted-foreground mb-8">Connect with {agents.length}+ trusted realtors in Kenya. Local property experts ready to help with all your real estate needs.</p>
      {agents.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {agents.map((agent) => (
              <Card key={agent.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarImage src={agent.photoURL || ''} alt={agent.displayName || ''} />
                    <AvatarFallback>{(agent.firstName?.[0] || '') + (agent.lastName?.[0] || '')}</AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-xl">{agent.displayName || `${agent.firstName} ${agent.lastName}`}</CardTitle>
                  {agent.agencyName && <p className="text-sm text-muted-foreground">{agent.agencyName}</p>}
                </CardHeader>
                <CardContent className="text-center space-y-3">
                  <Badge variant="secondary">Licensed Realtor</Badge>
                  {agent.phoneNumber && (
                    <p className="text-sm">📞 {agent.phoneNumber}</p>
                  )}
                  <Button asChild className="w-full">
                    <Link href={`/agents?agent=${agent.id}`}>Contact Realtor</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Button asChild size="lg">
              <Link href="/agents">View All Realtors</Link>
            </Button>
          </div>
        </>
      ) : (
        <p className="text-center py-12">No realtors available. <Link href="/agents" className="text-primary underline">Browse all agents</Link></p>
      )}
    </div>
  );
}