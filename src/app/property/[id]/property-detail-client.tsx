"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { SEOSchema } from '@/components/seo-schema';
import { OptimizedImage } from '@/components/optimized-image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MapPin, Bed, Bath, Maximize, Phone, Mail, Share2, Heart, MessageSquare, Eye, Calendar, Edit, Star, Copy, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import type { Property } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth-supabase';
import { useRouter } from 'next/navigation';
import { trackPropertyView } from '@/lib/view-tracking';
import { toWasabiProxyPath } from '@/lib/wasabi';
// Render all images in detail view via OptimizedImage (fit="contain") for perfect mobile fit
const Image = ((props: any) => <OptimizedImage fit="contain" sizes="100vw" fallbackSrc={null} {...props} />) as any;
// Use images exactly as returned by the API (already presigned for Wasabi)
function coerceImages(raw: unknown): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw as string[];
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
  }
  return [];
}

interface PropertyDetailClientProps {
  id: string;
}

export default function PropertyDetailClient({ id }: PropertyDetailClientProps) {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showCallbackForm, setShowCallbackForm] = useState(false);
  const [callbackName, setCallbackName] = useState('');
  const [callbackPhone, setCallbackPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();

  const handleShare = async () => {
    try {
      const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
      const title = property?.title || 'Property';
      const text = `${title} – ${property?.location || ''}, ${property?.city || ''}`.trim();
      if (navigator.share) {
        await navigator.share({ title, text, url: shareUrl });
        toast({ title: 'Shared', description: 'Link shared successfully.' });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast({ title: 'Link Copied', description: 'Property link copied to clipboard.' });
      }
    } catch (e: any) {
      try {
        const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
        await navigator.clipboard.writeText(shareUrl);
        toast({ title: 'Link Copied', description: 'Property link copied to clipboard.' });
      } catch {}
    }
  };

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      // Extract actual ID from slug-id format
      let actualId = id;
      if (id.includes('-')) {
        const parts = id.split('-');
        if (parts.length >= 5) {
          actualId = parts.slice(-5).join('-');
        }
      }

      // Prefer server API (presigns Wasabi URLs, consistent on mobile)
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const res = await fetch(`/api/properties/${actualId}`, { cache: 'no-store', signal: controller.signal });
      clearTimeout(timeout);
      if (!res.ok) throw new Error(`Failed to load property (${res.status})`);
      const data = await res.json();

      console.log('Fetched property data:', data);

      // API returns presigned Wasabi URLs (keep as-is) and legacy Supabase URLs
      const images = coerceImages(data.images)
        .map((img) => toWasabiProxyPath(img))
        .filter((img): img is string => Boolean(img));

      // Ensure agent contact is present; fetch profile if missing
      let agentProfile = data?.landlord;
      if (!agentProfile || !agentProfile.email || !agentProfile.phoneNumber) {
        try {
          const { data: prof } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.landlordId)
            .single();
          if (prof) agentProfile = { ...agentProfile, ...prof };
        } catch {}
      }

      const agent = agentProfile ? {
        uid: agentProfile.id,
        firstName: agentProfile.firstName || '',
        lastName: agentProfile.lastName || '',
        displayName: agentProfile.displayName || agentProfile.email?.split('@')[0] || '',
        email: agentProfile.email || '',
        role: (agentProfile.role as any) || 'agent',
        agencyName: agentProfile.agencyName,
        phoneNumber: agentProfile.phoneNumber,
        photoURL: agentProfile.photoURL,
        createdAt: agentProfile.createdAt ? new Date(agentProfile.createdAt) : new Date()
      } : undefined;

      setProperty({
        ...data,
        images,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
        agent,
      });

      setCurrentImageIndex(0);

      // Track property view (works for all users including anonymous)
      try {
        const newViewCount = await trackPropertyView(actualId);
        console.log('Property view tracked, new count:', newViewCount);
        
        // Update local state with new view count
        if (data && newViewCount > 0) {
          data.views = newViewCount;
        }
      } catch (viewError) {
        console.error('Error tracking property view:', viewError);
      }
    } catch (error) {
      console.error('Error fetching property:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this property?')) return;
    
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', property?.id);
      
      if (error) throw error;
      
      toast({ title: 'Success', description: 'Property deleted successfully.' });
      router.push('/admin/properties');
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message || 'Failed to delete property.' });
    }
  };

  const handleDuplicate = () => {
    if (property) {
      localStorage.setItem('duplicateProperty', JSON.stringify(property));
      router.push('/admin/properties/new');
      toast({ title: 'Property data copied', description: 'Edit and save to create a duplicate.' });
    }
  };

  const handleCallbackRequest = async () => {
    if (!callbackName || !callbackPhone) {
      toast({ title: 'Error', description: 'Please fill in all fields', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('callback_requests').insert({
        propertyId: property?.id,
        userName: callbackName,
        userPhone: callbackPhone,
        agentId: property?.landlordId,
        status: 'pending'
      });

      if (error) throw error;

      toast({ title: 'Success', description: 'Callback request sent! Agent will contact you soon.' });
      setShowCallbackForm(false);
      setCallbackName('');
      setCallbackPhone('');
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Failed to send request', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-96 w-full mb-4" />
        <Skeleton className="h-8 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold">Property not found</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8" itemScope itemType="https://schema.org/Accommodation">
      <SEOSchema type="property" data={property} />

      {user && property.landlordId === user.uid && (
        <Card className="mb-6 bg-muted/50">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" asChild>
              <Link href={`/admin/properties/edit/${property.id}`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Property
                </Link>
              </Button>
              <Button size="sm" variant="outline" asChild>
              <Link href={`/admin/properties/promote?propertyId=${property.id}`}>
                  <Star className="h-4 w-4 mr-2" />
                  Promote Property
                </Link>
              </Button>
              <Button size="sm" variant="outline" onClick={handleDuplicate}>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate Property
              </Button>
              <Button size="sm" variant="destructive" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Property
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="relative h-96 rounded-lg overflow-hidden group">
            {property.images && property.images.length > 0 ? (
              <>
                <Image
                  src={property.images[currentImageIndex]}
                  alt={property.title}
                  fill
                  className="object-cover"
                />
                {property.images.length > 1 && (
                  <>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? property.images!.length - 1 : prev - 1))}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => setCurrentImageIndex((prev) => (prev === property.images!.length - 1 ? 0 : prev + 1))}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    </Button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {property.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          aria-label={`View image ${index + 1} of ${property.images.length}`}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentImageIndex ? 'bg-white w-8' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground">No image available</span>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2" itemProp="name">{property.title}</h1>
                <div className="flex items-center text-muted-foreground" itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span itemProp="addressLocality">{property.location}</span>,{' '}
                  <span itemProp="addressRegion">{property.city}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary" itemProp="priceRange">
                  Ksh {property.price.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">{property.status === 'For Sale' ? '' : '/month'}</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Bed className="h-5 w-5 text-muted-foreground" />
                <span>{property.bedrooms} Bedrooms</span>
              </div>
              <div className="flex items-center gap-2">
                <Bath className="h-5 w-5 text-muted-foreground" />
                <span>{property.bathrooms} Bathrooms</span>
              </div>
              <div className="flex items-center gap-2">
                <Maximize className="h-5 w-5 text-muted-foreground" />
                <span>{property.area} sqft</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-muted-foreground" />
                <span>{property.views || 0} Views</span>
              </div>
              <Badge>{property.propertyType}</Badge>
              <Badge variant="secondary">{property.status}</Badge>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6 pb-6 border-b">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Listed {new Date(property.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span className="font-medium">{property.views || 0} total views</span>
              </div>
            </div>

            <div className="prose max-w-none">
              <h2 className="text-xl font-bold mb-2">Description</h2>
              <p className="text-muted-foreground">{property.description}</p>
            </div>

            {property.amenities && property.amenities.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-2">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((amenity, index) => (
                    <Badge key={index} variant="outline">{amenity}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-bold">Contact Agent</h3>
              <div className="space-y-3">
                <div>
                  {property.agent ? (
                    <>
                      <div className="font-semibold">{property.agent.displayName}</div>
                      {property.agent.agencyName && (
                        <div className="text-sm text-muted-foreground">{property.agent.agencyName}</div>
                      )}
                      {property.agent.phoneNumber && (
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {property.agent.phoneNumber}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-sm text-muted-foreground">Agent details unavailable. You can request a callback and we’ll notify the listing owner.</div>
                  )}
                </div>

                {property.agent?.phoneNumber && (
                  <Button className="w-full" asChild>
                    <a href={`tel:${property.agent.phoneNumber}`}>
                      <Phone className="h-4 w-4 mr-2" />
                      Call Agent
                    </a>
                  </Button>
                )}

                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => setShowCallbackForm(!showCallbackForm)}
                  type="button"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {showCallbackForm ? 'Cancel' : 'Request Callback'}
                </Button>
                {showCallbackForm && (
                  <div className="space-y-3 p-4 border rounded-lg">
                    <div className="space-y-2">
                      <Label>Your Name</Label>
                      <Input
                        value={callbackName}
                        onChange={(e) => setCallbackName(e.target.value)}
                        placeholder="Enter your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <Input
                        value={callbackPhone}
                        onChange={(e) => setCallbackPhone(e.target.value)}
                        placeholder="Enter your phone"
                      />
                    </div>
                    <Button onClick={handleCallbackRequest} disabled={isSubmitting} className="w-full">
                      {isSubmitting ? 'Sending...' : 'Send Request'}
                    </Button>
                  </div>
                )}

                {property.agent?.email && (
                  <Button variant="outline" className="w-full" asChild>
                    <a href={`mailto:${property.agent.email}`}>
                      <Mail className="h-4 w-4 mr-2" />
                      Email Agent
                    </a>
                  </Button>
                )}
              </div>
              <div className="flex gap-2 pt-4 border-t">
                <Button variant="outline" className="flex-1">
                  <Heart className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" className="flex-1" onClick={handleShare} aria-label="Share property">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
