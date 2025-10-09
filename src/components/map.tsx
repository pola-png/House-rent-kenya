
"use client";

import type { Property } from '@/lib/types';
import { Home } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";


interface MapProps {
  properties: Property[];
  property?: Property;
  zoom?: number;
}

export function Map({ properties, property, zoom = 11 }: MapProps) {
  // Since we removed @vis.gl/react-google-maps, we'll render a placeholder.
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  return (
    <div className="h-full w-full flex items-center justify-center bg-muted">
        <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle>Map View Disabled</AlertTitle>
            <AlertDescription>
                The interactive map has been disabled in this version. Property locations are available on the detail pages.
            </AlertDescription>
        </Alert>
    </div>
  );
}
