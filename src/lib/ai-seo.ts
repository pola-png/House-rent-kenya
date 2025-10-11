// AI-powered SEO optimization for property listings

const KENYA_PROPERTY_KEYWORDS = [
  'nairobi', 'mombasa', 'kisumu', 'nakuru', 'eldoret',
  'kilimani', 'westlands', 'karen', 'lavington', 'kileleshwa',
  'apartment', 'house', 'villa', 'townhouse', 'penthouse',
  'bedroom', 'bathroom', 'parking', 'garden', 'balcony',
  'furnished', 'unfurnished', 'modern', 'spacious', 'luxury',
  'affordable', 'secure', 'gated', 'compound', 'estate',
  'rent', 'sale', 'lease', 'available', 'immediate',
];

export async function generateSEODescription(propertyData: {
  title: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  location: string;
  city: string;
  amenities: string[];
  price: number;
}): Promise<string> {
  const { title, propertyType, bedrooms, bathrooms, location, city, amenities, price } = propertyData;

  // Build SEO-optimized description
  const parts = [
    `${bedrooms} bedroom ${propertyType.toLowerCase()} for rent in ${location}, ${city}.`,
    `This ${propertyType.toLowerCase()} features ${bathrooms} bathroom${bathrooms > 1 ? 's' : ''}`,
  ];

  // Add amenities with SEO keywords
  if (amenities.length > 0) {
    const topAmenities = amenities.slice(0, 3).join(', ');
    parts.push(`with ${topAmenities}.`);
  }

  // Add location-based keywords
  parts.push(`Located in ${location}, one of ${city}'s most sought-after neighborhoods.`);

  // Add price context
  const priceText = price < 50000 ? 'Affordable' : price > 150000 ? 'Premium' : 'Competitively priced';
  parts.push(`${priceText} at KSh ${price.toLocaleString()} per month.`);

  // Add call to action
  parts.push(`Contact us today to schedule a viewing. Available for immediate occupancy.`);

  return parts.join(' ');
}

export function extractKeywords(text: string): string[] {
  const words = text.toLowerCase().split(/\s+/);
  return words.filter(word => 
    KENYA_PROPERTY_KEYWORDS.includes(word) && word.length > 3
  );
}

export function optimizeTitle(title: string, location: string, propertyType: string): string {
  // Ensure title includes key SEO elements
  const hasLocation = title.toLowerCase().includes(location.toLowerCase());
  const hasType = title.toLowerCase().includes(propertyType.toLowerCase());

  if (hasLocation && hasType) return title;

  let optimized = title;
  if (!hasType) optimized = `${propertyType} - ${optimized}`;
  if (!hasLocation) optimized = `${optimized} in ${location}`;

  return optimized;
}

export async function generateAIKeywords(propertyData: {
  title: string;
  description: string;
  location: string;
  city: string;
  propertyType: string;
}): Promise<string> {
  const { title, description, location, city, propertyType } = propertyData;

  // Combine all text
  const allText = `${title} ${description} ${location} ${city} ${propertyType}`.toLowerCase();

  // Extract relevant keywords
  const keywords = new Set<string>();

  // Add location keywords
  keywords.add(location.toLowerCase());
  keywords.add(city.toLowerCase());

  // Add property type
  keywords.add(propertyType.toLowerCase());

  // Extract from text
  KENYA_PROPERTY_KEYWORDS.forEach(keyword => {
    if (allText.includes(keyword)) {
      keywords.add(keyword);
    }
  });

  // Add common search phrases
  keywords.add(`${propertyType.toLowerCase()} for rent ${location.toLowerCase()}`);
  keywords.add(`houses for rent ${city.toLowerCase()}`);
  keywords.add(`property for rent ${location.toLowerCase()}`);

  return Array.from(keywords).join(', ');
}

export function getSEOScore(title: string, description: string, keywords: string): {
  score: number;
  suggestions: string[];
} {
  const suggestions: string[] = [];
  let score = 0;

  // Check title length (50-60 chars is optimal)
  if (title.length >= 50 && title.length <= 60) {
    score += 20;
  } else {
    suggestions.push('Title should be 50-60 characters for optimal SEO');
  }

  // Check description length (150-160 chars is optimal)
  if (description.length >= 150 && description.length <= 300) {
    score += 20;
  } else {
    suggestions.push('Description should be 150-300 characters');
  }

  // Check for location keywords
  const hasLocation = KENYA_PROPERTY_KEYWORDS.some(kw => 
    title.toLowerCase().includes(kw) || description.toLowerCase().includes(kw)
  );
  if (hasLocation) {
    score += 20;
  } else {
    suggestions.push('Add location keywords (e.g., Nairobi, Kilimani)');
  }

  // Check for property type
  const propertyTypes = ['apartment', 'house', 'villa', 'townhouse'];
  const hasType = propertyTypes.some(type => 
    title.toLowerCase().includes(type) || description.toLowerCase().includes(type)
  );
  if (hasType) {
    score += 20;
  } else {
    suggestions.push('Include property type in title or description');
  }

  // Check keywords
  if (keywords && keywords.length > 20) {
    score += 20;
  } else {
    suggestions.push('Add more relevant keywords');
  }

  return { score, suggestions };
}
