import { notFound } from "next/navigation";
import { properties } from "@/lib/properties";
import { PropertyForm } from "../../components/property-form";

export default function EditPropertyPage({ params }: { params: { id: string } }) {
  const property = properties.find((p) => p.id === params.id);

  if (!property) {
    notFound();
  }

  return (
    <div>
        <h1 className="text-2xl font-bold font-headline mb-4">Edit Property</h1>
        <p className="text-muted-foreground mb-6">Editing property: <span className="font-semibold">{property.title}</span></p>
        <PropertyForm property={property} />
    </div>
  )
}
