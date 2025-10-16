"use client";

import { useEffect } from 'react';

interface SEOSchemaProps {
  type: 'property' | 'search' | 'homepage' | 'organization';
  data?: any;
}

export function SEOSchema({ type, data }: SEOSchemaProps) {
  useEffect(() => {
    let schema = {};

    switch (type) {
      case 'homepage':
        schema = {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "House Rent Kenya",
          "alternateName": "HouseRentKenya.co.ke",
          "url": "https://houserentkenya.co.ke",
          "description": "Kenya's leading property rental platform with 10,000+ verified properties",
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://houserentkenya.co.ke/search?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          },
          "publisher": {
            "@type": "Organization",
            "name": "House Rent Kenya",
            "logo": {
              "@type": "ImageObject",
              "url": "https://houserentkenya.co.ke/logo.png"
            }
          }
        };
        break;

      case 'property':
        if (data) {
          schema = {
            "@context": "https://schema.org",
            "@type": "Accommodation",
            "name": data.title,
            "description": data.description,
            "url": `https://houserentkenya.co.ke/property/${data.id}`,
            "image": data.images?.[0] || "https://houserentkenya.co.ke/default-property.jpg",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": data.location,
              "addressRegion": data.city,
              "addressCountry": "KE"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": data.latitude || -1.286389,
              "longitude": data.longitude || 36.817223
            },
            "priceRange": `KSh ${data.price}`,
            "priceCurrency": "KES",
            "numberOfRooms": data.bedrooms,
            "floorSize": {
              "@type": "QuantitativeValue",
              "value": data.area,
              "unitCode": "FTK"
            },
            "amenityFeature": data.amenities?.map((amenity: string) => ({
              "@type": "LocationFeatureSpecification",
              "name": amenity
            })) || [],
            "landlord": {
              "@type": "Person",
              "name": data.agent?.displayName || "Property Agent"
            },
            "datePosted": data.createdAt,
            "availabilityStarts": data.createdAt
          };
        }
        break;

      case 'search':
        schema = {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Property Search Results - House Rent Kenya",
          "description": "Search results for rental properties in Kenya",
          "url": "https://houserentkenya.co.ke/search",
          "mainEntity": {
            "@type": "ItemList",
            "numberOfItems": data?.totalResults || 0,
            "itemListElement": data?.properties?.map((property: any, index: number) => ({
              "@type": "ListItem",
              "position": index + 1,
              "item": {
                "@type": "Accommodation",
                "name": property.title,
                "url": `https://houserentkenya.co.ke/property/${property.id}`
              }
            })) || []
          }
        };
        break;

      case 'organization':
        schema = {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "House Rent Kenya",
          "alternateName": "HouseRentKenya.co.ke",
          "url": "https://houserentkenya.co.ke",
          "logo": "https://houserentkenya.co.ke/logo.png",
          "description": "Kenya's leading property rental platform",
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+254704202939",
            "contactType": "customer service",
            "areaServed": "KE",
            "availableLanguage": ["English", "Swahili"]
          },
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "KE",
            "addressLocality": "Nairobi"
          },
          "sameAs": [
            "https://facebook.com/houserentkenya",
            "https://twitter.com/houserentkenya",
            "https://instagram.com/houserentkenya"
          ]
        };
        break;
    }

    // Remove existing schema
    const existingScript = document.querySelector('script[data-schema-type]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new schema
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-schema-type', type);
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.querySelector(`script[data-schema-type="${type}"]`);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [type, data]);

  return null;
}