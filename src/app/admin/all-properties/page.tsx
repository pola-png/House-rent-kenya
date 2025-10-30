'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth-supabase';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building, Eye, MapPin, Calendar, Star, Trash2, Edit, 
  Search, Filter, CheckCircle, XCircle, Clock, Ban
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

interface Property {
  id: string;
  title: string;
  location: string;
  city: string;
  price: number;
  status: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  views: number;
  featured: boolean;
  isPremium: boolean;
  images: string[];
  createdAt: string;
  landlordId: string;
  landlordName: string;
  landlordEmail: string;
}

export default function AllPropertiesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');

  useEffect(() => {
    if (user?.role !== 'admin') {
      router.push('/admin/dashboard');
      return;
    }
    fetchAllProperties();
  }, [user, router]);

  useEffect(() => {
    filterProperties();
  }, [properties, searchTerm, statusFilter, cityFilter]);

  const fetchAllProperties = async () => {
    try {
      const { data: propertiesData, error: propsError } = await supabase
        .from('properties')
        .select(`
          *,
          profiles:landlordId (
            displayName,
            email
          )
        `)
        .order('createdAt', { ascending: false });

      if (propsError) throw propsError;

      const formattedProperties: Property[] = (propertiesData || []).map(p => ({
        ...p,
        landlordName: p.profiles?.displayName || 'Unknown',
        landlordEmail: p.profiles?.email || 'Unknown'
      }));

      setProperties(formattedProperties);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterProperties = () => {
    let filtered = properties;

    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.landlordName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.status === statusFilter);
    }

    if (cityFilter !== 'all') {
      filtered = filtered.filter(p => p.city === cityFilter);
    }

    setFilteredProperties(filtered);
  };

  const toggleFeatured = async (propertyId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ featured: !currentStatus })
        .eq('id', propertyId);

      if (error) throw error;

      toast({
        title: currentStatus ? 'Property Unfeatured' : 'Property Featured',
        description: 'Property status updated successfully.'
      });

      fetchAllProperties();
    } catch (error) {
      console.error('Error updating featured status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update property status.',
        variant: 'destructive'
      });
    }
  };

  const togglePremium = async (propertyId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ isPremium: !currentStatus })
        .eq('id', propertyId);

      if (error) throw error;

      toast({
        title: currentStatus ? 'Premium Removed' : 'Premium Added',
        description: 'Property premium status updated.'
      });

      fetchAllProperties();
    } catch (error) {
      console.error('Error updating premium status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update premium status.',
        variant: 'destructive'
      });
    }
  };

  const deleteProperty = async (propertyId: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return;

    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId);

      if (error) throw error;

      toast({
        title: 'Property Deleted',
        description: 'Property has been permanently deleted.'
      });

      fetchAllProperties();
    } catch (error) {
      console.error('Error deleting property:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete property.',
        variant: 'destructive'
      });
    }
  };

  const updatePropertyStatus = async (propertyId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ status: newStatus })
        .eq('id', propertyId);

      if (error) throw error;

      toast({
        title: 'Status Updated',
        description: `Property status changed to ${newStatus}.`
      });

      fetchAllProperties();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update property status.',
        variant: 'destructive'
      });
    }
  };

  const cities = [...new Set(properties.map(p => p.city))];
  const stats = {
    total: properties.length,
    active: properties.filter(p => p.status === 'For Rent' || p.status === 'For Sale').length,
    featured: properties.filter(p => p.featured).length,
    premium: properties.filter(p => p.isPremium).length
  };

  if (user?.role !== 'admin') return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">All Properties</h1>
          <p className="text-muted-foreground">Manage all properties across the platform</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.featured}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Premium</CardTitle>
            <Star className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.premium}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search properties, locations, or owners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="For Rent">For Rent</SelectItem>
                <SelectItem value="For Sale">For Sale</SelectItem>
                <SelectItem value="Rented">Rented</SelectItem>
                <SelectItem value="Sold">Sold</SelectItem>
              </SelectContent>
            </Select>
            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by city" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {cities.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Properties List */}
      <Card>
        <CardHeader>
          <CardTitle>Properties ({filteredProperties.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredProperties.map((property) => (
              <div key={property.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  {property.images?.[0] ? (
                    <Image
                      src={property.images[0]}
                      alt={property.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <Building className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold truncate">{property.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {property.location}, {property.city}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>By {property.landlordName}</span>
                        <span>•</span>
                        <span>{property.bedrooms}BR</span>
                        <span>•</span>
                        <span>{property.views || 0} views</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">Ksh {property.price.toLocaleString()}</div>
                      <Badge variant={
                        property.status === 'For Rent' || property.status === 'For Sale' ? 'default' :
                        property.status === 'Rented' || property.status === 'Sold' ? 'secondary' : 'outline'
                      }>
                        {property.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs">Featured</span>
                    <Switch
                      checked={property.featured}
                      onCheckedChange={() => toggleFeatured(property.id, property.featured)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs">Premium</span>
                    <Switch
                      checked={property.isPremium}
                      onCheckedChange={() => togglePremium(property.id, property.isPremium)}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <Select
                    value={property.status}
                    onValueChange={(value) => updatePropertyStatus(property.id, value)}
                  >
                    <SelectTrigger className="w-32 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="For Rent">For Rent</SelectItem>
                      <SelectItem value="For Sale">For Sale</SelectItem>
                      <SelectItem value="Rented">Rented</SelectItem>
                      <SelectItem value="Sold">Sold</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteProperty(property.id)}
                    className="h-8 text-xs"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}