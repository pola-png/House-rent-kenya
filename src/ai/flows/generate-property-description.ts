'use server';

/**
 * @fileOverview Generates engaging and informative property descriptions based on key features and amenities.
 *
 * - generatePropertyDescription - A function that generates property descriptions.
 * - GeneratePropertyDescriptionInput - The input type for the generatePropertyDescription function.
 * - GeneratePropertyDescriptionOutput - The return type for the generatePropertyDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePropertyDescriptionInputSchema = z.object({
  propertyType: z.string().describe('The type of property (e.g., apartment, house, condo).'),
  location: z.string().describe('The location of the property.'),
  bedrooms: z.number().describe('The number of bedrooms in the property.'),
  bathrooms: z.number().describe('The number of bathrooms in the property.'),
  amenities: z.string().describe('A comma-separated list of amenities (e.g., pool, gym, parking).'),
  additionalFeatures: z.string().describe('Any additional features of the property.'),
});
export type GeneratePropertyDescriptionInput = z.infer<typeof GeneratePropertyDescriptionInputSchema>;

const GeneratePropertyDescriptionOutputSchema = z.object({
  description: z.string().describe('The generated property description.'),
});
export type GeneratePropertyDescriptionOutput = z.infer<typeof GeneratePropertyDescriptionOutputSchema>;

export async function generatePropertyDescription(
  input: GeneratePropertyDescriptionInput
): Promise<GeneratePropertyDescriptionOutput> {
  return generatePropertyDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePropertyDescriptionPrompt',
  input: {schema: GeneratePropertyDescriptionInputSchema},
  output: {schema: GeneratePropertyDescriptionOutputSchema},
  prompt: `You are an expert real estate copywriter. Generate an engaging and informative property description based on the following key features and amenities:

Property Type: {{{propertyType}}}
Location: {{{location}}}
Bedrooms: {{{bedrooms}}}
Bathrooms: {{{bathrooms}}}
Amenities: {{{amenities}}}
Additional Features: {{{additionalFeatures}}}

Write a compelling description that highlights the property's best features and attracts potential renters. Take inspiration from https://privatepropertykenya.com when writing the description. Focus on SEO best practices, including keyword optimization and clear, concise language.
`,
});

const generatePropertyDescriptionFlow = ai.defineFlow(
  {
    name: 'generatePropertyDescriptionFlow',
    inputSchema: GeneratePropertyDescriptionInputSchema,
    outputSchema: GeneratePropertyDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
