'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Star, Wifi, Car, PenTool } from 'lucide-react';
import { useHotelsByRatingQuery } from '@/generated';
import { HotelSkeletonGrid } from './HotelSkeleton';

export const PopularHotels = () => {
  const router = useRouter();
  const { data, loading, error } = useHotelsByRatingQuery({
    variables: { rating: 2.0 },
  });

  const handleViewAll = () => {
    router.push('/popular-hotels');
  };

  const handleHotelClick = (hotelId: string) => {
    router.push(`/hotel/${hotelId}`);
  };

  const getRatingText = (rating: number): string => {
    if (rating >= 8.5) return 'Excellent';
    if (rating >= 8.0) return 'Very Good';
    if (rating >= 7.5) return 'Good';
    if (rating >= 7.0) return 'Fair';
    return 'Poor';
  };

  const renderStars = (stars: number) => {
    return Array.from({ length: 5 }, (_, i) => <Star key={i} size={16} className={i < stars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />);
  };

  const getAmenityIcon = (amenity: string) => {
    if (amenity.toLowerCase().includes('wifi')) return <Wifi size={16} />;
    if (amenity.toLowerCase().includes('spa')) return <PenTool size={16} />;
    if (amenity.toLowerCase().includes('parking')) return <Car size={16} />;
    return null;
  };

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-8 py-16">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Popular Hotels</h2>
          <button onClick={handleViewAll} className="px-6 py-3 bg-[#013B94] text-white rounded-lg hover:bg-[#012a6b] transition-colors">
            View all
          </button>
        </div>

        {/* Loading Skeleton */}
        <HotelSkeletonGrid count={8} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto px-8 py-16">
        <div className="text-center">
          <div className="text-xl text-red-600">Error loading hotels: {error.message}</div>
        </div>
      </div>
    );
  }

  const hotels = data?.hotelsByRating || [];

  const topHotels = [...hotels].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 8);

  return (
    <div className="w-full max-w-7xl mx-auto px-8 py-16">
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900">Popular Hotels</h2>
        <button onClick={handleViewAll} className="px-6 py-3 bg-[#013B94] text-white rounded-lg hover:bg-[#012a6b] transition-colors">
          View all
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* eslint-disable-next-line complexity */}
        {topHotels.map((hotel) => (
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
    </div>
  );
};
