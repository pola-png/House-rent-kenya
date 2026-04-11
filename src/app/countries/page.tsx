import Link from 'next/link';
import type { Metadata } from 'next';

import { COUNTRIES, slugifyCountry } from '@/lib/countries';
import { BRAND } from '@/lib/brand';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: `Countries | ${BRAND.name}`,
  description: `Explore country-specific property search pages across global markets with ${BRAND.name}.`,
  openGraph: {
    title: `Countries | ${BRAND.name}`,
    description: `Explore property search pages across countries worldwide.`,
    url: `${BRAND.siteUrl}/countries`,
    type: 'website',
  },
  alternates: {
    canonical: `${BRAND.siteUrl}/countries`,
  },
};

export default function CountriesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mb-10">
        <h1 className="text-3xl md:text-4xl font-bold font-headline mb-4">Browse Property Markets by Country</h1>
        <p className="text-lg text-muted-foreground">
          Explore country SEO pages for rentals, homes for sale, agents, and property search trends across global markets.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
        {COUNTRIES.map((country) => (
          <Card key={country} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <Link
                href={`/countries/${slugifyCountry(country)}`}
                className="font-medium hover:text-primary transition-colors"
              >
                {country}
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button asChild size="lg">
        <Link href="/search">Search All Properties</Link>
      </Button>
    </div>
  );
}
