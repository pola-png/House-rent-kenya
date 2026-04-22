'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth-supabase';
import { supabase } from '@/lib/supabase';
import { getAccessTokenSync } from '@/lib/token-cache';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Building, MapPin, Star, Trash2, Search, CheckCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import {
  AdminMetricCardsSkeleton,
  AdminPageHeaderSkeleton,
  AdminTableSkeleton,
} from '@/components/admin/admin-page-skeleton';
import { formatCompactNumber } from '@/lib/format-number';

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
  featuredExpiresAt?: string | null;
  isPremium: boolean;
  images: string[];
  createdAt: string;
  landlordId: string;
  landlordName: string;
  landlordEmail: string;
}

export default function AllPropertiesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [featuredFilter, setFeaturedFilter] = useState('all');
  const [promotedFilter, setPromotedFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user || user.role !== 'admin') {
      router.push('/admin/dashboard');
      return;
    }

    setIsLoading(true);
    fetchAllProperties();
  }, [user, loading, router]);

  useEffect(() => {
    filterProperties();
  }, [properties, searchTerm, statusFilter, cityFilter, featuredFilter, promotedFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, cityFilter, featuredFilter, promotedFilter]);

  const normalize = (value: unknown) => String(value ?? '').trim().toLowerCase();

  const matchesFlagFilter = (value: boolean, filter: string) => {
    if (filter === 'featured-only' || filter === 'promoted-only') return value;
    if (filter === 'not-featured' || filter === 'not-promoted') return !value;
    return true;
  };

  const getAuthHeaders = () => {
    const token = getAccessTokenSync();
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const refreshPropertyCache = async (propertyId: string) => {
    try {
      await fetch('/api/revalidate', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ tags: ['properties:list', `property:${propertyId}`] }),
      });
    } catch {}
  };

  const runPropertyAction = async (
    propertyId: string,
    options: { method: 'PATCH' | 'DELETE'; body?: Record<string, unknown> }
  ) => {
    const response = await fetch(`/api/admin/properties/${propertyId}`, {
      method: options.method,
      headers: getAuthHeaders(),
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload?.error || 'Property action failed.');
    }

    await refreshPropertyCache(propertyId);
    return payload;
  };

  const fetchAllProperties = async () => {
    try {
      const { data: propertiesData, error: propsError } = await supabase
        .from('properties')
        .select('*')
        .order('createdAt', { ascending: false });

      if (propsError) throw propsError;

      // Get landlord info separately
      const landlordIds = [...new Set(propertiesData?.map(p => p.landlordId).filter(Boolean))];
      const { data: landlordsData } = await supabase
        .from('profiles')
        .select('id, displayName, email, firstName, lastName')
        .in('id', landlordIds);

      const landlordsMap = landlordsData?.reduce((acc: any, landlord) => {
        acc[landlord.id] = landlord;
        return acc;
      }, {}) || {};

      const formattedProperties: Property[] = (propertiesData || []).map(p => {
        const landlord = landlordsMap[p.landlordId];
        return {
          ...p,
          landlordName: landlord?.displayName || landlord?.firstName + ' ' + landlord?.lastName || 'Unknown',
          landlordEmail: landlord?.email || 'Unknown'
        };
      });

      setProperties(formattedProperties);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterProperties = () => {
    let filtered = properties;
    const searchValue = normalize(searchTerm);

    if (searchValue) {
      filtered = filtered.filter((p) => {
        const haystack = [
          p.title,
          p.location,
          p.city,
          p.propertyType,
          p.status,
          p.landlordName,
          p.landlordEmail,
          p.id,
        ]
          .map(normalize)
          .join(' ');

        return haystack.includes(searchValue);
      });
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.status === statusFilter);
    }

    if (cityFilter !== 'all') {
      filtered = filtered.filter(p => p.city === cityFilter);
    }

    if (featuredFilter !== 'all') {
      filtered = filtered.filter((p) => matchesFlagFilter(Boolean(p.featured), featuredFilter));
    }

    if (promotedFilter !== 'all') {
      filtered = filtered.filter((p) => matchesFlagFilter(Boolean(p.isPremium), promotedFilter));
    }

    setFilteredProperties(filtered);
  };

  const toggleFeatured = async (propertyId: string, currentStatus: boolean) => {
    try {
      const nextFeatured = !currentStatus;
      const nextExpiry = nextFeatured
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        : null;

      const updatedProperty = await runPropertyAction(propertyId, {
        method: 'PATCH',
        body: { featured: nextFeatured, featuredExpiresAt: nextExpiry },
      });

      setProperties((prev) =>
        prev.map((property) =>
          property.id === propertyId
            ? { ...property, ...updatedProperty, featured: nextFeatured, featuredExpiresAt: nextExpiry }
            : property
        )
      );

      toast({
        title: currentStatus ? 'Property Unfeatured' : 'Property Featured',
        description: 'Property status updated successfully.'
      });

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
      const nextPremium = !currentStatus;
      const updatedProperty = await runPropertyAction(propertyId, {
        method: 'PATCH',
        body: { isPremium: nextPremium },
      });

      setProperties((prev) =>
        prev.map((property) =>
          property.id === propertyId
            ? { ...property, ...updatedProperty, isPremium: nextPremium }
            : property
        )
      );

      toast({
        title: currentStatus ? 'Premium Removed' : 'Premium Added',
        description: 'Property premium status updated.'
      });

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
      await runPropertyAction(propertyId, { method: 'DELETE' });
      setProperties((prev) => prev.filter((property) => property.id !== propertyId));

      toast({
        title: 'Property Deleted',
        description: 'Property has been permanently deleted.'
      });
    } catch (error) {
      console.error('Error deleting property:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete property.',
        variant: 'destructive'
      });
    }
  };

  if (loading || isLoading || !user || user.role !== 'admin') {
    return (
      <div className="space-y-6">
        <AdminPageHeaderSkeleton />
        <AdminMetricCardsSkeleton />
        <AdminTableSkeleton rows={8} columns={6} />
      </div>
    );
  }

  const updatePropertyStatus = async (propertyId: string, newStatus: string) => {
    try {
      const updatedProperty = await runPropertyAction(propertyId, {
        method: 'PATCH',
        body: { status: newStatus },
      });

      setProperties((prev) =>
        prev.map((property) =>
          property.id === propertyId ? { ...property, ...updatedProperty, status: newStatus } : property
        )
      );

      toast({
        title: 'Status Updated',
        description: `Property status changed to ${newStatus}.`
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update property status.',
        variant: 'destructive'
      });
    }
  };

  const cities = [...new Set(properties.map((p) => p.city).filter(Boolean))];
  const stats = {
    total: properties.length,
    active: properties.filter(p => p.status === 'For Rent' || p.status === 'For Sale').length,
    featured: properties.filter(p => p.featured).length,
    premium: properties.filter(p => p.isPremium).length,
    totalViews: properties.reduce((sum, p) => sum + (p.views || 0), 0),
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProperties = filteredProperties.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

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
            <div className="text-2xl font-bold">{formatCompactNumber(stats.total)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCompactNumber(stats.active)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCompactNumber(stats.featured)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Premium</CardTitle>
            <Star className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCompactNumber(stats.premium)}</div>
            <p className="text-xs text-muted-foreground mt-1">{formatCompactNumber(stats.totalViews)} views</p>
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
            <Select value={featuredFilter} onValueChange={setFeaturedFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by featured" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Featured</SelectItem>
                <SelectItem value="featured-only">Featured Only</SelectItem>
                <SelectItem value="not-featured">Not Featured</SelectItem>
              </SelectContent>
            </Select>
            <Select value={promotedFilter} onValueChange={setPromotedFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by promoted" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Promoted</SelectItem>
                <SelectItem value="promoted-only">Promoted Only</SelectItem>
                <SelectItem value="not-promoted">Not Promoted</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Properties List */}
      <Card>
          <CardHeader>
            <CardTitle>Properties ({formatCompactNumber(filteredProperties.length)})</CardTitle>
          </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentProperties.map((property) => (
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
                        <span>{formatCompactNumber(property.views || 0)} views</span>
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
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredProperties.length)} of {filteredProperties.length} properties
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(1)}
                    disabled={currentPage === 1}
                  >
                    First
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  {(() => {
                    const startPage = Math.floor((currentPage - 1) / 10) * 10 + 1;
                    const endPage = Math.min(startPage + 9, totalPages);
                    const pages = [];
                    
                    for (let i = startPage; i <= endPage; i++) {
                      pages.push(
                        <Button
                          key={i}
                          variant={currentPage === i ? "default" : "outline"}
                          size="sm"
                          onClick={() => goToPage(i)}
                          className="w-8 h-8 p-0"
                        >
                          {i}
                        </Button>
                      );
                    }
                    return pages;
                  })()}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    Last
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
