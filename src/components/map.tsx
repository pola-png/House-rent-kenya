"use client";

import { APIProvider, Map as GoogleMap, AdvancedMarker } from '@vis.gl/react-google-maps';
import type { Property } from '@/lib/types';
import { Home } from 'lucide-react';

interface MapProps {
  properties: Property[];
  property?: Property;
  zoom?: number;
}

export function Map({ properties, property, zoom = 11 }: MapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    // This message is for developers and will be visible if the API key is not set.
    // A user-friendly message is shown in `search/page.tsx`
    return <div className="h-full w-full flex items-center justify-center bg-muted text-destructive">Google Maps API key is missing.</div>;
  }
  
  const centerPosition = property
    ? { lat: property.latitude, lng: property.longitude }
    : properties.length > 0
    ? { lat: properties[0].latitude, lng: properties[0].longitude }
    : { lat: -1.286389, lng: 36.817223 }; // Default to Nairobi

  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID || 'DEMO_MAP_ID';

  return (
    <APIProvider apiKey={apiKey}>
      <GoogleMap
        style={{ width: '100%', height: '100%' }}
        defaultCenter={centerPosition}
        defaultZoom={zoom}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
        mapId={mapId}
      >
        {property && (
            <AdvancedMarker position={{ lat: property.latitude, lng: property.longitude }}>
                <div className="p-2 bg-primary rounded-full shadow-lg">
                    <Home className="w-6 h-6 text-primary-foreground" />
                </div>
            </AdvancedMarker>
        )}
        {!property && properties.map((prop) => (
          <AdvancedMarker key={prop.id} position={{ lat: prop.latitude, lng: prop.longitude }}>
             <div className="w-3 h-3 bg-primary rounded-full border-2 border-primary-foreground shadow-md"></div>
          </AdvancedMarker>
        ))}
      </GoogleMap>
    </APIProvider>
  );
}
