import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, MapPin, Building, Star } from 'lucide-react';
import { Metadata } from 'next';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Real Estate Agents Near Me in Kenya | Find Top Property Agents',
  description: 'Find verified real estate agents near you in Kenya. Connect with top property agents in Nairobi, Mombasa, Kisumu. Licensed professionals for buying, selling & renting properties.',
  keywords: [
    'real estate agents Kenya',
    'property agents near me',
    'real estate agents Nairobi',
    'property agents Mombasa',
    'real estate agents Kisumu',
    'licensed property agents Kenya',
    'top real estate agents',
    'property consultants Kenya',
    'real estate brokers Kenya',
    'property dealers Kenya'
  ],
  openGraph: {
    title: 'Real Estate Agents Near Me in Kenya | Find Top Property Agents',
    description: 'Connect with verified real estate agents in Kenya. Licensed professionals for all your property needs.',
    url: 'https://houserentkenya.co.ke/real-estate-agents-near-me',
    type: 'website',
    images: ['/real-estate-agents-og.jpg']
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Real Estate Agents Near Me in Kenya',
    description: 'Find verified real estate agents in Kenya. Licensed professionals for buying, selling & renting.',
  },
  alternates: {
    canonical: 'https://houserentkenya.co.ke/real-estate-agents-near-me'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

async function getAgents() {
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .in('role', ['agent', 'admin'])
    .order('createdAt', { ascending: false })
    .limit(20);
  
  if (!profiles) return [];
  
  // Get property counts for each agent
  const agentIds = profiles.map(p => p.id);
  const { data: properties } = await supabase
    .from('properties')
    .select('landlordId')
    .in('landlordId', agentIds)
    .in('status', ['Available', 'For Rent', 'For Sale']);
  
  const propertyCountMap = new Map();
  properties?.forEach(p => {
    propertyCountMap.set(p.landlordId, (propertyCountMap.get(p.landlordId) || 0) + 1);
  });
  
  return profiles.map(p => ({
    ...p,
    propertyCount: propertyCountMap.get(p.id) || 0,
    createdAt: new Date(p.createdAt)
  }));
}

export default async function Page() {
  const agents = await getAgents();
  
  return (
    <>
      {/* JSON-LD Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Real Estate Agents Near Me in Kenya",
            "description": "Find verified real estate agents in Kenya. Licensed professionals for buying, selling & renting properties.",
            "url": "https://houserentkenya.co.ke/real-estate-agents-near-me",
            "mainEntity": {
              "@type": "ItemList",
              "name": "Real Estate Agents in Kenya",
              "numberOfItems": agents.length,
              "itemListElement": agents.slice(0, 10).map((agent, index) => ({
                "@type": "Person",
                "@id": `https://houserentkenya.co.ke/agents/${agent.id}`,
                "name": agent.displayName || `${agent.firstName || ''} ${agent.lastName || ''}`.trim(),
                "jobTitle": "Real Estate Agent",
                "telephone": agent.phoneNumber,
                "email": agent.email,
                "worksFor": {
                  "@type": "Organization",
                  "name": agent.agencyName || "House Rent Kenya"
                },
                "address": {
                  "@type": "PostalAddress",
                  "addressCountry": "Kenya"
                }
              }))
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://houserentkenya.co.ke"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Real Estate Agents",
                  "item": "https://houserentkenya.co.ke/real-estate-agents-near-me"
                }
              ]
            }
          })
        }}
      />
      
      <div className="container mx-auto px-4 py-8" itemScope itemType="https://schema.org/WebPage">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4" itemProp="name">
            Real Estate Agents Near Me - Kenya
          </h1>
          <p className="text-lg text-muted-foreground mb-6" itemProp="description">
            Connect with {agents.length}+ verified real estate agents in Kenya. Find trusted property experts near you in Nairobi, Mombasa, Kisumu and across the country.
          </p>
          
          {/* SEO Content Section */}
          <div className="bg-muted/30 p-6 rounded-lg mb-8">
            <h2 className="text-2xl font-semibold mb-4">Why Choose Our Real Estate Agents?</h2>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <h3 className="font-semibold mb-2">Licensed & Verified Professionals</h3>
                <p className="text-muted-foreground mb-4">
                  All our real estate agents are licensed professionals with verified credentials. 
                  They have extensive knowledge of the Kenyan property market and local regulations.
                </p>
                
                <h3 className="font-semibold mb-2">Local Market Expertise</h3>
                <p className="text-muted-foreground">
                  Our agents specialize in different regions across Kenya including Nairobi, Mombasa, 
                  Kisumu, Nakuru, and Eldoret with deep understanding of local property values.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Full-Service Support</h3>
                <p className="text-muted-foreground mb-4">
                  From property search to closing deals, our agents provide comprehensive support 
                  for buying, selling, and renting properties in Kenya.
                </p>
                
                <h3 className="font-semibold mb-2">Transparent Process</h3>
                <p className="text-muted-foreground">
                  No hidden fees or surprise charges. Our agents maintain transparency throughout 
                  the entire property transaction process.
                </p>
              </div>
            </div>
          </div>
        </header>
      
      {agents.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {agents.map((agent) => (
              <Card key={agent.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-16 w-16">
                      {agent.photoURL && <AvatarImage src={agent.photoURL} alt={agent.displayName} />}
                      <AvatarFallback className="text-lg">
                        {(agent.firstName?.charAt(0) || agent.displayName?.charAt(0) || 'A').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold">
                        {agent.displayName || `${agent.firstName || ''} ${agent.lastName || ''}`.trim() || 'Agent'}
                      </h3>
                      {agent.role === 'admin' && (
                        <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs">
                          <Star className="h-3 w-3 mr-1" />
                          Premium Agent
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {agent.agencyName && (
                    <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
                      <Building className="h-4 w-4" />
                      <span>{agent.agencyName}</span>
                    </div>
                  )}
                  
                  <div className="space-y-2 mb-4">
                    {agent.phoneNumber && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-green-600" />
                        <a href={`tel:${agent.phoneNumber}`} className="hover:text-green-600">
                          {agent.phoneNumber}
                        </a>
                      </div>
                    )}
                    
                    {agent.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-blue-600" />
                        <a href={`mailto:${agent.email}`} className="hover:text-blue-600">
                          {agent.email}
                        </a>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t">
                    <span className="text-sm text-muted-foreground">
                      {agent.propertyCount} Properties
                    </span>
                    <Button size="sm" asChild>
                      <Link href={`/search?agent=${agent.id}`}>
                        View Properties
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mb-12">
            <Button asChild size="lg">
              <Link href="/agents">View All Agents</Link>
            </Button>
          </div>
          
          {/* Additional SEO Content */}
          <section className="mt-16">
            <h2 className="text-3xl font-bold mb-6">Find Real Estate Agents by Location</h2>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div>
                <h3 className="text-xl font-semibold mb-3">Nairobi Real Estate Agents</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Find top real estate agents in Nairobi specializing in Westlands, Kilimani, Karen, 
                  Lavington, and other prime areas. Expert knowledge of Nairobi property market.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/search?q=nairobi&agent=true">Nairobi Agents</Link>
                </Button>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">Mombasa Property Agents</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Connect with licensed real estate agents in Mombasa for coastal properties, 
                  beachfront homes, and commercial real estate along the Kenyan coast.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/search?q=mombasa&agent=true">Mombasa Agents</Link>
                </Button>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-3">Kisumu Real Estate Experts</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Professional real estate agents in Kisumu with expertise in lakeside properties, 
                  residential homes, and investment opportunities in Western Kenya.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/search?q=kisumu&agent=true">Kisumu Agents</Link>
                </Button>
              </div>
            </div>
            
            <h2 className="text-3xl font-bold mb-6">Real Estate Services in Kenya</h2>
            <div className="prose max-w-none text-muted-foreground">
              <p className="mb-4">
                Our network of real estate agents in Kenya provides comprehensive property services including 
                residential sales, commercial leasing, property management, and investment consulting. Whether 
                you're a first-time buyer, seasoned investor, or looking to rent, our agents have the expertise 
                to guide you through the Kenyan real estate market.
              </p>
              
              <p className="mb-4">
                From luxury homes in Karen and Runda to affordable housing in Kasarani and Githurai, 
                our agents cover all price ranges and property types across Kenya. They understand local 
                market conditions, legal requirements, and can help navigate the property buying or renting process.
              </p>
              
              <p>
                Contact our real estate agents today to start your property journey in Kenya. 
                All agents are verified, licensed, and committed to providing exceptional service 
                to help you find your perfect property.
              </p>
            </div>
          </section>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="mb-4">No agents available at the moment.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/search">Browse Properties</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      )}
      </div>
    </>
  );
}