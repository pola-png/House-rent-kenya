'use server';

/**
 * @fileOverview This file defines a Genkit flow for optimizing property listing SEO.
 *
 * - optimizeListingSEO - A function that analyzes a property listing and suggests SEO improvements.
 * - OptimizeListingSEOInput - The input type for the optimizeListingSEO function.
 * - OptimizeListingSEOOutput - The return type for the optimizeListingSEO function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeListingSEOInputSchema = z.object({
  listingTitle: z.string().describe('The current title of the property listing.'),
  listingDescription: z.string().describe('The current description of the property listing.'),
  listingKeywords: z.string().describe('The current keywords associated with the property listing.'),
  propertyType: z.string().describe('The type of property (e.g., apartment, house, condo).'),
  propertyLocation: z.string().describe('The location of the property.'),
  numberOfBedrooms: z.number().describe('The number of bedrooms in the property.'),
  numberOfBathrooms: z.number().describe('The number of bathrooms in the property.'),
  amenities: z.string().describe('A comma-separated list of amenities offered by the property.'),
});

export type OptimizeListingSEOInput = z.infer<typeof OptimizeListingSEOInputSchema>;

const OptimizeListingSEOOutputSchema = z.object({
  optimizedTitle: z.string().describe('The optimized title for the property listing.'),
  optimizedDescription: z.string().describe('The optimized description for the property listing.'),
  optimizedKeywords: z.string().describe('The optimized keywords for the property listing.'),
  seoScore: z.number().describe('A score from 0 to 100 representing the overall SEO effectiveness of the listing.'),
  suggestions: z.array(z.string()).describe('Specific suggestions for improving the SEO of the listing.'),
});

export type OptimizeListingSEOOutput = z.infer<typeof OptimizeListingSEOOutputSchema>;

export async function optimizeListingSEO(input: OptimizeListingSEOInput): Promise<OptimizeListingSEOOutput> {
  return optimizeListingSEOFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeListingSEOPrompt',
  input: {schema: OptimizeListingSEOInputSchema},
  output: {schema: OptimizeListingSEOOutputSchema},
  prompt: `You are an SEO expert specializing in optimizing property listings for search engines. Analyze the following property listing information and provide suggestions for improvement.

  Listing Title: {{{listingTitle}}}
  Listing Description: {{{listingDescription}}}
  Listing Keywords: {{{listingKeywords}}}
  Property Type: {{{propertyType}}}
  Property Location: {{{propertyLocation}}}
  Number of Bedrooms: {{{numberOfBedrooms}}}
  Number of Bathrooms: {{{numberOfBathrooms}}}
  Amenities: {{{amenities}}}

  Consider best practices from privatepropertykenya.com when formulating suggestions. privatepropertykenya.com is an expert in the field of house rentals in kenya.

  Provide an optimized title, description, and keywords, along with an SEO score (0-100) and specific suggestions for improvement. Ensure the output is tailored for the Kenyan rental market.
  Remember to provide output as a parseable JSON object.
  `,
});

const optimizeListingSEOFlow = ai.defineFlow(
  {
    name: 'optimizeListingSEOFlow',
    inputSchema: OptimizeListingSEOInputSchema,
    outputSchema: OptimizeListingSEOOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
