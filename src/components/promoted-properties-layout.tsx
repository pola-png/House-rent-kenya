import { PropertyCard } from '@/components/property-card';
import type { Property } from '@/lib/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface PromotedPropertiesLayoutProps {
  promoted: Property[];
  regular: Property[];
  totalProperties: number;
  title: string;
  description: string;
  featuredSectionTitle: string;
  regularSectionTitle?: string;
  viewAllLink: string;
  viewAllText: string;
}

export function PromotedPropertiesLayout({
  promoted,
  regular,
  totalProperties,
  title,
  description,
  featuredSectionTitle,
  regularSectionTitle,
  viewAllLink,
  viewAllText
}: PromotedPropertiesLayoutProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      <p className="text-lg text-muted-foreground mb-8">
        {description}
        {promoted.length > 0 && ` Featuring ${promoted.length} premium listings.`}
      </p>
      
      {totalProperties > 0 ? (
        <>
          {/* Featured/Promoted Properties Section */}
          {promoted.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  ⭐ {featuredSectionTitle}
                </div>
                <span className="text-sm text-muted-foreground">({promoted.length})</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {promoted.map((property) => (
                  <PropertyCard key={`featured-${property.id}`} property={property} />
                ))}
              </div>
            </div>
          )}
          
          {/* Regular Properties Section */}
          {regular.length > 0 && (
            <div className="mb-8">
              {promoted.length > 0 && regularSectionTitle && (
                <div className="flex items-center gap-2 mb-6">
                  <h3 className="text-2xl font-semibold">{regularSectionTitle}</h3>
                  <span className="text-sm text-muted-foreground">({regular.length})</span>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regular.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            </div>
          )}
          
          <div className="text-center">
            <Button asChild size="lg">
              <Link href={viewAllLink}>{viewAllText}</Link>
            </Button>
          </div>
        </>
      ) : (
        <p className="text-center py-12">
          No properties available. <Link href="/search" className="text-primary underline">Browse all properties</Link>
        </p>
      )}
    </div>
  );
}