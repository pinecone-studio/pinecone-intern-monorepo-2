import { Hotel } from '@/types/hotel';
import { Wifi, Car, Star, MapPin } from 'lucide-react';

interface HotelCardProps {
  hotel: Hotel;
}

const getStarRating = (hotel: Hotel): number => {
  return hotel.stars || 3;
};

const getBadgeInfo = (rating: number) => {
  if (rating >= 9) return { text: 'Excellent' };
  if (rating >= 8) return { text: 'Very Good' };
  if (rating >= 6) return { text: 'Good' };
  if (rating >= 5) return { text: 'Fair' };
  return { text: 'Poor' };
};

export const HotelCard = ({ hotel }: HotelCardProps) => {
  const starRating = getStarRating(hotel);
  const badgeInfo = getBadgeInfo(hotel.rating || 3);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer">
      <div className="relative">
        <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
          {hotel.image ? (
            <img
              src={hotel.image}
              alt={hotel.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : null}
          {!hotel.image && <div className="text-gray-500 text-sm">Hotel Image</div>}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2">{hotel.name}</h3>
        {hotel.city && hotel.country && (
          <p className="text-sm text-gray-500 mb-2 flex items-center">
            <MapPin className="w-3 h-3 mr-1" />
            {hotel.city}, {hotel.country}
          </p>
        )}
        <div className="flex items-center mb-3">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < starRating ? 'text-orange-400 fill-orange-400' : 'text-gray-300'}`} />
          ))}
          <span className="ml-2 text-sm text-gray-600">({starRating} stars)</span>
        </div>
        <div className="space-y-2 mb-4">
          {hotel.amenities.slice(0, 3).map((amenity, index) => (
            <div key={index} className="flex items-center text-sm text-gray-600">
              {amenity.toLowerCase().includes('wifi') && <Wifi className="w-4 h-4 mr-2 text-green-500" />}
              {amenity.toLowerCase().includes('parking') && <Car className="w-4 h-4 mr-2 text-blue-500" />}
              {amenity.toLowerCase().includes('spa') && <div className="w-4 h-4 mr-2 bg-purple-500 rounded-full" />}
              {amenity}
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <p className={`inline-block px-3 py-1 rounded-full text-white text-xs font-medium bg-blue-600`}>{hotel.rating}</p>
            <p className="text-[14px] text-gray-600"> {badgeInfo.text}</p>
          </div>

          {hotel.price && <span className="text-lg font-bold text-blue-600">${hotel.price}</span>}
        </div>
      </div>
    </div>
  );
};
