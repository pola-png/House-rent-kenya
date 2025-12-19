# Promoted Properties Implementation Guide

## Overview
This guide explains how the promoted properties feature works and how to implement it across your website pages.

## What's Been Implemented

### 1. Enhanced Search Results (`/search`)
- **Featured Properties Section**: Promoted properties are displayed prominently at the top in a highlighted section
- **Visual Indicators**: Golden gradient background and special badges
- **Separate Sections**: Clear separation between featured and regular properties
- **Count Display**: Shows number of featured properties in results

### 2. Location-Based Pages
Updated the following pages to show promoted properties:
- `/bedsitter-for-rent-in-kasarani` - Bedsitter properties in Kasarani
- `/house-rent-in-nairobi` - All rental properties in Nairobi  
- `/1-bedroom-for-rent-in-kenya` - 1-bedroom properties nationwide

### 3. Enhanced Property Cards
- **Featured Badge**: Golden "FEATURED" badge with star icon for promoted properties
- **Ring Border**: Yellow ring around promoted property cards
- **Expired Indication**: Gray "EXPIRED" badge for properties with expired promotions

### 4. Utility Functions
Created reusable functions in `/src/lib/promoted-properties.ts`:
- `getPropertiesWithPromotion()` - Fetches and separates promoted vs regular properties
- `renderPromotedPropertiesSection()` - Helper for rendering logic

### 5. Reusable Layout Component
Created `/src/components/promoted-properties-layout.tsx` for consistent promoted properties display.

## How Promoted Properties Work

### Database Logic
Properties are considered "promoted" when:
- `isPremium = true` AND
- `featuredExpiresAt` is either NULL or a future date

### Display Priority
1. **Featured Section**: Active promoted properties shown first in highlighted section
2. **Regular Section**: Non-promoted and expired promoted properties shown below
3. **Visual Hierarchy**: Clear visual distinction with colors, badges, and borders

### Search Engine Benefits
When users search for properties (e.g., "Bedsitter for Rent in Kasarani"):
- **Promoted properties appear prominently** at the top of results
- **Better visibility** for paying customers
- **Improved click-through rates** due to featured placement
- **Enhanced user experience** with clearly marked premium listings

## How to Apply to Other Pages

### Method 1: Using the Utility Function
```typescript
import { getPropertiesWithPromotion } from '@/lib/promoted-properties';

export default async function YourPage() {
  const { promoted, regular, all } = await getPropertiesWithPromotion({
    location: 'your-location', // optional
    city: 'your-city', // optional  
    bedrooms: 2, // optional
    maxBedrooms: 3, // optional
    status: 'For Rent', // optional
    propertyType: 'Apartment', // optional
    limit: 20 // optional
  });

  // Use promoted, regular, and all arrays in your JSX
}
```

### Method 2: Using the Layout Component
```typescript
import { PromotedPropertiesLayout } from '@/components/promoted-properties-layout';
import { getPropertiesWithPromotion } from '@/lib/promoted-properties';

export default async function YourPage() {
  const { promoted, regular, all } = await getPropertiesWithPromotion({
    // your filters
  });

  return (
    <PromotedPropertiesLayout
      promoted={promoted}
      regular={regular}
      totalProperties={all.length}
      title="Your Page Title"
      description="Your page description"
      featuredSectionTitle="Featured Properties in Your Area"
      regularSectionTitle="More Properties in Your Area"
      viewAllLink="/search?your=params"
      viewAllText="View All Properties"
    />
  );
}
```

## Pages That Should Be Updated

Apply this pattern to these location-based pages:
- `/1-bedroom-house-for-rent-in-kisumu`
- `/2-bedroom-house-for-rent-in-mombasa`
- `/3-bedroom-house-for-rent-in-meru`
- `/2-bedroom-rent-in-kenya`
- `/3-bedroom-rent-in-kenya`
- `/houses-for-rent-in-kenya`
- `/nairobi-properties`
- Any other location or property-type specific pages

## SEO Benefits

### For Search Engines
- **Better User Engagement**: Featured properties get more clicks
- **Improved Dwell Time**: Users spend more time on pages with promoted content
- **Higher Quality Signals**: Premium listings indicate active, maintained content

### For Property Owners
- **Increased Visibility**: Properties appear at the top of search results
- **Better Conversion**: Featured placement leads to more inquiries
- **Competitive Advantage**: Stand out from regular listings

## Testing the Implementation

1. **Create a promoted property** in your admin panel
2. **Set `isPremium = true`** and `featuredExpiresAt` to a future date
3. **Visit search pages** and location pages to see the featured section
4. **Verify visual indicators** (badges, borders, highlighting)
5. **Test expiration** by setting `featuredExpiresAt` to a past date

## Maintenance

### Regular Tasks
- Monitor promoted property expiration dates
- Update featured sections when promotions expire
- Track performance metrics for promoted vs regular properties
- Adjust visual styling based on user feedback

### Database Maintenance
```sql
-- Find expired promotions
SELECT id, title, featuredExpiresAt 
FROM properties 
WHERE isPremium = true 
AND featuredExpiresAt < NOW();

-- Clean up expired promotions
UPDATE properties 
SET isPremium = false 
WHERE featuredExpiresAt < NOW();
```

This implementation ensures that when users search for properties through Google and land on your website, they'll immediately see the most valuable (promoted) properties first, improving both user experience and revenue from property promotions.