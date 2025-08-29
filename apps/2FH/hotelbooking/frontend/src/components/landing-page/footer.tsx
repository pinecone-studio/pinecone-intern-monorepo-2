"use client";
import { Button } from "@/components/ui/button";
import { HotelCard } from "./hotel-card";

const featuredHotels = [
  {
    id: 1,
    title: "Luxury Art Gallery Hotel",
    subtitle: "Boutique hotel with curated art collection",
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
    badgeText: "Art Collection"
  },
  {
    id: 2,
    title: "Modern Lounge & Bar",
    subtitle: "Stylish accommodations with premium amenities",
    imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop",
    badgeText: "Premium"
  },
  {
    id: 3,
    title: "Hotel Nine H",
    subtitle: "Contemporary urban luxury",
    imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop",
    badgeText: "Urban Luxury"
  }
];

export default function FeaturedHotels() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Featured Hotels
            </h2>
            <p className="text-gray-600">
              Discover our handpicked selection of exceptional accommodations
            </p>
          </div>
          <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
            View all
          </Button>
        </div>

        {/* Hotel Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredHotels.map((hotel) => (
            <HotelCard
              key={hotel.id}
              title={hotel.title}
              subtitle={hotel.subtitle}
              imageUrl={hotel.imageUrl}
              badgeText={hotel.badgeText}
            />
          ))}
        </div>
      </div>
    </section>
  );
} 
