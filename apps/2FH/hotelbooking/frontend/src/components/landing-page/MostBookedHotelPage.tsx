'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Star, Wifi, Car, PenTool } from 'lucide-react';
import { useHotelsByRatingQuery } from '@/generated';
import { HotelSkeletonGrid } from '@/components/landing-page/HotelSkeleton';

export const MostBookedHotelsPage = () => {
  const router = useRouter();

  const { data, loading, error } = useHotelsByRatingQuery({
    variables: { rating: 2.0 },
  });

  const handleHotelClick = (hotelId: string) => {
    router.push(`/hotel/${hotelId}`);
  };

  const getRatingText = (rating: number): string => {
    if (rating >= 8.5) return 'Excellent';
    if (rating >= 8.0) return 'Very Good';
    if (rating >= 7.0) return 'Good';
    if (rating >= 6.0) return 'Fair';
    return 'Poor';
  };

  const renderStars = (stars: number) => {
    return Array.from({ length: 5 }, (_, i) => <Star key={i} size={16} className={i < stars ? 'fill-orange-400 text-orange-400' : 'text-gray-300'} />);
  };

  const getAmenityIcon = (amenity: string) => {
    if (amenity.toLowerCase().includes('wifi')) return <Wifi size={16} />;
    if (amenity.toLowerCase().includes('spa')) return <PenTool size={16} />;
    if (amenity.toLowerCase().includes('parking')) return <Car size={16} />;
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="w-full max-w-7xl mx-auto px-8 py-16">
          {/* Page Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Most Booked Hotels in Mongolia</h1>
            <p className="text-lg text-gray-600">Discover the most popular and highly-rated hotels in Mongolia, sorted by popularity</p>
          </div>

          {/* Loading Skeleton */}
          <HotelSkeletonGrid count={12} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="text-xl text-red-600">Error loading hotels: {error.message}</div>
          </div>
        </div>
      </div>
    );
  }

  const allHotels = data?.hotelsByRating || [];
  const mongolianHotels = allHotels.filter((hotel) => hotel.country === 'Mongolia').sort((a, b) => (b.rating || 0) - (a.rating || 0));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full max-w-7xl mx-auto px-8 py-16">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Most Booked Hotels in Mongolia</h1>
          <p className="text-lg text-gray-600">Discover the most popular and highly-rated hotels in Mongolia, sorted by popularity</p>
        </div>

        {/* Mongolian Hotels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* eslint-disable-next-line complexity */}
          {mongolianHotels.map((hotel) => (
            <div key={hotel.id} onClick={() => handleHotelClick(hotel.id)} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
              <div className="h-48 bg-gray-200 relative">
                {hotel.images && hotel.images.length > 0 ? (
                  <Image src={hotel.images[0]} alt={hotel.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-500">No image</span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{hotel.name}</h3>

                {/* Location */}
                <div className="text-sm text-gray-600 mb-3">
                  {hotel.city && `${hotel.city}, `}
                  {hotel.country}
                </div>

                <div className="flex items-center mb-3">
                  {renderStars(hotel.stars || 0)}
                  <span className="ml-2 text-sm text-gray-600">({hotel.stars || 0} stars)</span>
                </div>

                <div className="space-y-2 mb-4">
                  {hotel.amenities &&
                    hotel.amenities.slice(0, 3).map((amenity, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                        {getAmenityIcon(amenity)}
                        <span>{amenity}</span>
                      </div>
                    ))}
                </div>

                <div className="bg-[#013B94] text-white px-3 py-1 rounded-full inline-flex items-center gap-2">
                  <span className="font-semibold">{(hotel.rating || 0).toFixed(1)}</span>
                  <span className="text-sm">{getRatingText(hotel.rating || 0)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Results Count */}
        <div className="text-center mt-12">
          <p className="text-gray-600 text-lg">Showing {mongolianHotels.length} hotels in Mongolia</p>
        </div>

        {/* No Results Message */}
        {mongolianHotels.length === 0 && (
          <div className="text-center mt-12">
            <p className="text-gray-600 text-lg">No hotels found in Mongolia.</p>
          </div>
        )}
      </div>
    </div>
  );
};
