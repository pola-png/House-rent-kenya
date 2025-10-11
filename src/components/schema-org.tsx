export function WebsiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'House Rent Kenya',
    url: 'https://house-rent-kenya.vercel.app',
    description: 'Kenya\'s #1 property portal for rentals and sales',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://house-rent-kenya.vercel.app/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'House Rent Kenya',
    url: 'https://house-rent-kenya.vercel.app',
    logo: 'https://house-rent-kenya.vercel.app/logo.png',
    description: 'Kenya\'s leading property rental and sales platform',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'KE',
      addressLocality: 'Nairobi',
    },
    sameAs: [
      'https://facebook.com/houserentkenya',
      'https://twitter.com/houserentkenya',
      'https://instagram.com/houserentkenya',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function PropertySchema({ property }: { property: any }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.title,
    description: property.description,
    price: property.price,
    priceCurrency: 'KES',
    address: {
      '@type': 'PostalAddress',
      addressLocality: property.location,
      addressRegion: property.city,
      addressCountry: 'KE',
    },
    numberOfRooms: property.bedrooms,
    floorSize: {
      '@type': 'QuantitativeValue',
      value: property.area,
      unitCode: 'SQM',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
