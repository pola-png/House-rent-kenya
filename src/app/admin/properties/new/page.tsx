import { PropertyForm } from "../components/property-form";

export default function NewPropertyPage() {
  return (
    <div>
        <h1 className="text-2xl font-bold font-headline mb-2">Post a Property</h1>
        <p className="text-muted-foreground mb-6">Showcase your property to thousands of potential tenants and buyers.</p>
        <PropertyForm />
    </div>
  )
}
