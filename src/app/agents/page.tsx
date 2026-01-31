'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Building, Mail, Phone, User, Users, Search, Filter, MapPin, Star, Award, Calendar, MessageSquare } from 'lucide-react';
import type { UserProfile } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';

export default function AgentsPage() {
  const [agents, setAgents] = useState<UserProfile[]>([]);
  const [agentStats, setAgentStats] = useState<Record<string, { properties: number; rating: number; responseTime: string; isProAgent?: boolean }>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'agent')
        .order('createdAt', { ascending: false });

      if (error) throw error;

      const typedAgents: UserProfile[] = (data || []).map(a => ({
        uid: a.id,
        firstName: a.firstName || '',
        lastName: a.lastName || '',
        displayName: a.displayName || a.email?.split('@')[0] || '',
        email: a.email || '',
        role: a.role as "user" | "agent",
        agencyName: a.agencyName,
        phoneNumber: a.phoneNumber,
        photoURL: a.photoURL,
        createdAt: new Date(a.createdAt)
      }));

      setAgents(typedAgents);
      
      // Fetch real stats for all agents in batch queries
      const agentIds = typedAgents.map(a => a.uid);
      const stats: Record<string, { properties: number; rating: number; responseTime: string }> = {};
      
      // Batch fetch all properties with promotion status
      const { data: allProperties } = await supabase
        .from('properties')
        .select('id, landlordId, isPremium, featuredExpiresAt')
        .in('landlordId', agentIds);
        
      // Batch fetch all ratings
      const { data: allRatings } = await supabase
        .from('agent_ratings')
        .select('rating, agentId')
        .in('agentId', agentIds);
        
      // Batch fetch all responses
      const { data: allResponses } = await supabase
        .from('callback_requests')
        .select('createdAt, respondedAt, agentId')
        .in('agentId', agentIds)
        .not('respondedAt', 'is', null);
      
      // Process stats for each agent
      for (const agent of typedAgents) {
        const properties = allProperties?.filter(p => p.landlordId === agent.uid) || [];
        const hasPromotedProperties = properties.some(p => 
          p.isPremium || (p.featuredExpiresAt && new Date(p.featuredExpiresAt) > new Date())
        );
        const ratings = allRatings?.filter(r => r.agentId === agent.uid) || [];
        const responses = allResponses?.filter(r => r.agentId === agent.uid) || [];
        
        const propertyCount = properties.length;
        const avgRating = ratings.length ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length : 0;
        
        let avgResponseTime = 'No data';
        if (responses.length) {
          const totalTime = responses.reduce((sum, r) => {
            const created = new Date(r.createdAt).getTime();
            const responded = new Date(r.respondedAt).getTime();
            return sum + (responded - created);
          }, 0);
          const avgMs = totalTime / responses.length;
          const avgHours = Math.round(avgMs / (1000 * 60 * 60));
          avgResponseTime = avgHours > 0 ? `${avgHours}h` : '<1h';
        }
        
        stats[agent.uid] = {
          properties: propertyCount,
          rating: avgRating,
          responseTime: avgResponseTime,
          isProAgent: hasPromotedProperties
        };
      }
      
      setAgentStats(stats);
    } catch (error) {
      console.error('Error fetching agents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAndSortedAgents = useMemo(() => {
    let filtered = agents.filter(agent => {
      const matchesSearch = agent.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (agent.agencyName || '').toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });

    // Sort agents by PRO status, properties count, and rating
    filtered.sort((a, b) => {
      const aStats = agentStats[a.uid] || { properties: 0, rating: 0, responseTime: 'No data', isProAgent: false };
      const bStats = agentStats[b.uid] || { properties: 0, rating: 0, responseTime: 'No data', isProAgent: false };
      
      // First by PRO status
      if (aStats.isProAgent !== bStats.isProAgent) {
        return bStats.isProAgent ? 1 : -1;
      }
      
      // Then by properties count
      if (aStats.properties !== bStats.properties) {
        return bStats.properties - aStats.properties;
      }
      
      // Then by rating
      if (aStats.rating !== bStats.rating) {
        return bStats.rating - aStats.rating;
      }
      
      // Finally by sort preference
      switch (sortBy) {
        case 'name':
          return a.displayName.localeCompare(b.displayName);
        case 'agency':
          return (a.agencyName || '').localeCompare(b.agencyName || '');
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return filtered;
  }, [agents, agentStats, searchTerm, locationFilter, sortBy]);

  const uniqueAgencies = useMemo(() => {
    const agencies = agents.map(a => a.agencyName).filter(Boolean);
    return [...new Set(agencies)];
  }, [agents]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-blue-600 rounded-full mb-6">
            <Users className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-headline bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-4">
            Find Your Agent
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Connect with professional and verified real estate agents across Kenya. Find the perfect agent to help you buy, sell, or rent your property.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <Award className="h-3 w-3 mr-1" /> Verified Agents
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              <Star className="h-3 w-3 mr-1" /> Top Rated
            </Badge>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              <MessageSquare className="h-3 w-3 mr-1" /> Instant Contact
            </Badge>
          </div>
        </div>

        {/* Search and Filter Section */}
        <Card className="mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search agents or agencies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-11"
                  />
                </div>
              </div>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Filter by location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="nairobi">Nairobi</SelectItem>
                  <SelectItem value="mombasa">Mombasa</SelectItem>
                  <SelectItem value="kisumu">Kisumu</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="agency">Agency A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
              <span>Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredAndSortedAgents.length)}-{Math.min(currentPage * itemsPerPage, filteredAndSortedAgents.length)} of {filteredAndSortedAgents.length} agents</span>
              <span>{uniqueAgencies.length} agencies represented</span>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="shadow-lg">
                <CardHeader className="items-center text-center pb-4">
                  <Skeleton className="h-24 w-24 rounded-full" />
                  <Skeleton className="h-6 w-40 mt-4" />
                  <Skeleton className="h-4 w-32" />
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <Skeleton className="h-5 w-48 mx-auto" />
                  <div className="space-y-2 pt-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredAndSortedAgents.length > 0 ? (
          <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedAgents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(agent => {
              const agentPhoneNumber = agent.phoneNumber || '+254704202939';
              const joinedDate = new Date(agent.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
              const stats = agentStats[agent.uid] || { properties: 0, rating: 0, responseTime: 'No data', isProAgent: false };
              return (
              <Card key={agent.uid} className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white/90 backdrop-blur-sm border-0">
                <CardHeader className="items-center text-center pb-4">
                  <div className="relative">
                    <Avatar className="h-24 w-24 mb-4 ring-4 ring-primary/10 group-hover:ring-primary/30 transition-all">
                      {agent.photoURL && <AvatarImage src={agent.photoURL} alt={agent.displayName} />}
                      <AvatarFallback className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 text-white">
                        {agent.displayName?.charAt(0).toUpperCase() || <User />}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 bg-green-500 text-white rounded-full p-1">
                      <Award className="h-3 w-3" />
                    </div>
                  </div>
                  <CardTitle className="font-headline text-xl mb-2 flex items-center justify-center gap-2">
                    {agent.displayName}
                    {stats.isProAgent && (
                      <>
                        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs px-2 py-1">
                          PRO
                        </Badge>
                        <span className="text-yellow-500" title="Premium Agent">
                          👑
                        </span>
                      </>
                    )}
                  </CardTitle>
                  <div className="space-y-2">
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                      <Building className="h-3 w-3 mr-1" />
                      {agent.agencyName || 'Independent Agent'}
                    </Badge>
                    <div className="flex items-center justify-center text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      Joined {joinedDate}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="text-center p-2 bg-muted/30 rounded-lg">
                      <div className="font-bold text-lg text-primary">{stats.rating > 0 ? stats.rating.toFixed(1) : 'N/A'}</div>
                      <div className="text-muted-foreground">Rating</div>
                    </div>
                    <div className="text-center p-2 bg-muted/30 rounded-lg">
                      <div className="font-bold text-lg text-primary">{stats.properties}</div>
                      <div className="text-muted-foreground">Properties</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Button asChild className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                      <a href={`tel:${agentPhoneNumber}`}>
                        <Phone className="h-4 w-4 mr-2" /> Call Now
                      </a>
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" asChild className="border-primary/20 hover:bg-primary/5">
                        <a href={`mailto:${agent.email}?subject=Property Inquiry&body=Hi ${agent.displayName}, I'm interested in your properties. Please contact me.`}>
                          <Mail className="h-3 w-3 mr-1" /> Email
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" asChild className="border-primary/20 hover:bg-primary/5">
                        <a href={`tel:${agentPhoneNumber}`}>
                          <MessageSquare className="h-3 w-3 mr-1" /> Chat
                        </a>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-muted/30">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Response time</span>
                      <span className="text-green-600 font-medium">{stats.responseTime}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )})}
          </div>
          
          {filteredAndSortedAgents.length > itemsPerPage && (
            <div className="mt-12 flex justify-center">
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.ceil(filteredAndSortedAgents.length / itemsPerPage) }, (_, i) => i + 1)
                    .slice(0, 5)
                    .map(page => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="w-10 h-10"
                      >
                        {page}
                      </Button>
                    ))}
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentPage(p => Math.min(Math.ceil(filteredAndSortedAgents.length / itemsPerPage), p + 1))}
                  disabled={currentPage === Math.ceil(filteredAndSortedAgents.length / itemsPerPage)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-6">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No agents found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your search criteria or browse all agents.</p>
            <Button onClick={() => { setSearchTerm(''); setLocationFilter('all'); }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}