import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PromotedPropertiesLayout } from '@/components/promoted-properties-layout';
import { BRAND } from '@/lib/brand';
import { COUNTRIES, getCountryBySlug, slugifyCountry } from '@/lib/countries';
import { getPropertiesWithPromotion } from '@/lib/promoted-properties';

interface CountryPageProps {
  params: Promise<{ country: string }>;
}

export async function generateStaticParams() {
  return COUNTRIES.map((country) => ({ country: slugifyCountry(country) }));
}

export async function generateMetadata({ params }: CountryPageProps): Promise<Metadata> {
  const { country: slug } = await params;
  const country = getCountryBySlug(slug);

  if (!country) {
    return {};
  }

  const title = `Property in ${country} | ${BRAND.name}`;
  const description = `Explore homes for rent, houses for sale, apartments, and real estate agents in ${country} with ${BRAND.name}.`;

  return {
    title,
    description,
    keywords: [
      `property in ${country}`,
      `homes for rent in ${country}`,
      `houses for sale in ${country}`,
      `apartments in ${country}`,
      `real estate in ${country}`,
    ],
    openGraph: {
      title,
      description,
      url: `${BRAND.siteUrl}/countries/${slug}`,
      type: 'website',
    },
    alternates: {
      canonical: `${BRAND.siteUrl}/countries/${slug}`,
    },
  };
}

export default async function CountryPage({ params }: CountryPageProps) {
  const { country: slug } = await params;
  const country = getCountryBySlug(slug);

  if (!country) {
    notFound();
  }

  const { promoted, regular, all } = await getPropertiesWithPromotion({
    location: country,
    limit: 20,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: `Property in ${country}`,
            description: `Explore homes for rent, sale properties, and agents in ${country}.`,
            url: `${BRAND.siteUrl}/countries/${slug}`,
            mainEntity: {
              '@type': 'Place',
              name: country,
            },
          }),
        }}
      />
      <PromotedPropertiesLayout
        promoted={promoted}
        regular={regular}
        totalProperties={all.length}
        title={`Property in ${country}`}
        description={`Browse ${all.length}+ listings, agents, and property opportunities connected to ${country}. Search rentals, homes for sale, and investment properties in one place.`}
        featuredSectionTitle={`Featured Property in ${country}`}
        regularSectionTitle={`More Listings for ${country}`}
        viewAllLink={`/search?q=${encodeURIComponent(country)}`}
        viewAllText={`Search ${country}`}
      />
    </>
  );
}
