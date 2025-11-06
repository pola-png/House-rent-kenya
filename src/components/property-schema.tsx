import { Property } from '@/lib/types';
import { toWasabiProxyAbsolute } from '@/lib/wasabi';

interface PropertySchemaProps {
  property: Property;
}

export function PropertySchema({ property }: PropertySchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": property.title,
    "description": property.description,
    "url": `https://houserentkenya.co.ke/property/${property.id}`,
    "image": property.images?.[0]
      ? toWasabiProxyAbsolute(property.images[0])
      : "https://houserentkenya.co.ke/default-property.jpg",
    "datePosted": property.createdAt,
    "validThrough": new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days from now
    "offers": {
      "@type": "Offer",
      "price": property.price,
      "priceCurrency": "KES",
      "availability": "https://schema.org/InStock",
      "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      "seller": {
        "@type": "Person",
        "name": property.agent?.displayName || "Property Agent",
        "telephone": "+254706060684"
      }
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": property.location,
      "addressRegion": property.city,
      "addressCountry": "KE"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": property.latitude || -1.286389,
      "longitude": property.longitude || 36.817223
    },
    "floorSize": {
      "@type": "QuantitativeValue",
      "value": property.area,
      "unitCode": "SQM"
    },
    "numberOfRooms": property.bedrooms,
    "numberOfBathroomsTotal": property.bathrooms,
    "accommodationCategory": property.propertyType,
    "amenityFeature": property.amenities?.map(amenity => ({
      "@type": "LocationFeatureSpecification",
      "name": amenity
    })) || [],
    "landlord": {
      "@type": "RealEstateAgent",
      "name": property.agent?.displayName || "House Rent Kenya Agent",
      "telephone": "+254706060684",
      "email": "info@houserentkenya.co.ke"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
