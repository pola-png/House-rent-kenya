# Add AI SEO to Property Form - Simple Instructions

## Step 1: Add Import

At the top of `src/app/admin/properties/components/property-form.tsx`, add this import after line 38:

```typescript
import { AISEOSimple } from '@/components/ai-seo-simple';
```

## Step 2: Replace SEO Card

Find the SEO Card section (around line 600) that looks like this:

```typescript
<Card>
    <CardHeader>
        <CardTitle>SEO</CardTitle>
        <CardDescription>Improve your listing's visibility on search engines.</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="keywords"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Keywords</FormLabel>
              <FormControl>
                <Input placeholder="e.g., apartment for rent, Kilimani" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
    </CardContent>
</Card>
```

Replace it with:

```typescript
<Card>
    <CardHeader>
        <CardTitle>AI SEO Optimization</CardTitle>
        <CardDescription>Generate SEO-optimized content with one click.</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
        <AISEOSimple
          formData={{
            title: form.watch('title') || '',
            description: form.watch('description') || '',
            propertyType: form.watch('propertyType') || 'Apartment',
            bedrooms: form.watch('bedrooms') || 1,
            bathrooms: form.watch('bathrooms') || 1,
            location: form.watch('location') || '',
            city: form.watch('city') || 'Nairobi',
            amenities: form.watch('amenities') || '',
            price: form.watch('price') || 0,
          }}
          onApply={(data) => {
            form.setValue('title', data.title);
            form.setValue('description', data.description);
            form.setValue('keywords', data.keywords);
          }}
        />
        <FormField
          control={form.control}
          name="keywords"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Keywords</FormLabel>
              <FormControl>
                <Input placeholder="e.g., apartment for rent, Kilimani" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
    </CardContent>
</Card>
```

## Step 3: Save and Test

1. Save the file
2. The form will now have a "Generate AI SEO Content" button
3. Fill in basic property info (title, location, city, bedrooms, etc.)
4. Click the AI button
5. It will auto-fill optimized title, description, and keywords

## Done!

Your property form now has AI-powered SEO optimization! 🎉

Commit and push:
```powershell
git add .
git commit -m "Add AI SEO to property form"
git push
```
