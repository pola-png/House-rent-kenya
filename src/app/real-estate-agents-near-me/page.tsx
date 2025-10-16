import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export const revalidate = 3600;

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
      <h1 className="text-4xl font-bold mb-4">Real Estate Agents Near Me - Find Local Property Experts</h1>
      <p className="text-lg text-muted-foreground mb-8">Connect with {agents.length}+ verified real estate agents in Kenya. Professional property experts ready to help you buy, sell or rent.</p>
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
                  <Badge variant="secondary">Real Estate Agent</Badge>
                  {agent.phoneNumber && (
                    <p className="text-sm">📞 {agent.phoneNumber}</p>
                  )}
                  <Button asChild className="w-full">
                    <Link href={`/agents?agent=${agent.id}`}>View Profile</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Button asChild size="lg">
              <Link href="/agents">View All Real Estate Agents</Link>
            </Button>
          </div>
        </>
      ) : (
        <p className="text-center py-12">No agents available. <Link href="/agents" className="text-primary underline">Browse all agents</Link></p>
      )}
    </div>
  );
}