// Test property submission
const testPropertyData = {
  title: "Test Property",
  description: "This is a test property description that is long enough to pass validation requirements.",
  price: 50000,
  location: "Kilimani",
  city: "Nairobi",
  bedrooms: 2,
  bathrooms: 1,
  area: 100,
  propertyType: "Apartment",
  amenities: ["WiFi", "Parking"],
  status: "For Rent",
  keywords: "apartment, kilimani, nairobi",
  featured: false,
  latitude: -1.286389,
  longitude: 36.817223,
  landlordId: "test-user-id",
  images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"]
};

console.log("Test property data:", JSON.stringify(testPropertyData, null, 2));
console.log("All required fields present:", 
  testPropertyData.title && 
  testPropertyData.description && 
  testPropertyData.price && 
  testPropertyData.landlordId
);