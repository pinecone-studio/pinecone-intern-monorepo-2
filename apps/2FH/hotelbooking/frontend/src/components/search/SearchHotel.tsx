'use client';

import Image from 'next/image';
import { Star } from 'lucide-react';
import { Amenity } from '@/generated';
import { useRouter } from 'next/navigation';
import { useHotelsQuery } from '@/generated';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type SearchHotelProps = {
  search: string;
  selectedStars: string;
  selectedRating: string;
  amenities: string;
};
export const SearchHotel = ({ search, selectedStars, selectedRating, amenities }: SearchHotelProps) => {
  const { data, loading } = useHotelsQuery();
  const router = useRouter();

  const handleClickHotel = (hotelId: string) => {
    router.push(`/hotel/${hotelId}`);
  };

  if (loading) return <p>Loading...</p>;

  const filteredHotels = data?.hotels
    ?.filter((hotel) => hotel.name.toLowerCase().includes(search.toLowerCase()))
    ?.filter((hotel) => (selectedStars ? hotel.stars === Number(selectedStars) : true)) /* eslint-disable complexity */
    ?.filter((hotel) => {
      if (!selectedRating) return true;

      const rating = Number(selectedRating);
      if (rating === 9) return hotel.rating >= 9;
      if (rating === 8) return hotel.rating >= 8 && hotel.rating < 9;
      if (rating === 7) return hotel.rating >= 7 && hotel.rating < 8;
      return true;
    })
    ?.filter((hotel) => (amenities ? hotel.amenities.includes(amenities as Amenity) : true));

  return (
    <div className="w-[872px] flex flex-col gap-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium"> {filteredHotels?.length} Properties </p>
        <div className="w-[240px] py-2 px-3">
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Recommended" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recommended">Recommended</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="rating-asc">Star: Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {filteredHotels?.slice(0, 6).map((hotel) => (
        <div data-testid="hotel-card" key={hotel.id} className="flex rounded-lg shadow-lg overflow-hidden cursor-pointer" onClick={() => handleClickHotel(hotel.id)}>
          <Image src={hotel.images[0]} alt={hotel.name} width={395} height={222} className="object-cover" />
          <div className="flex-1 p-6 flex justify-between">
            <div className="flex flex-col justify-between">
              <div className="flex flex-col gap-y-3">
                <h3 className="text-xl font-bold text-black">{hotel.name}</h3>
                <div className="flex gap-x-1">
                  {Array.from({ length: hotel.stars }).map((_, index) => (
                    <Star data-testid="star" key={index} className="w-4 h-4 text-[#F97316] fill-current" />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-x-2">
                <Badge className="bg-blue-600 text-white px-2 py-1 rounded-full text-sm font-medium">{hotel.rating}</Badge>
                <span className="text-sm font-medium text-black">Excellent</span>
              </div>
            </div>

            <div className="flex flex-col items-end justify-end gap-y-1">
              <div className="flex flex-col items-end">
                <p className="text-xs text-gray-500">Per night</p>
                <p className="text-xl font-bold text-black">170,000₮</p>
              </div>
              <p className="text-xs text-gray-500">210,000₮ total</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
