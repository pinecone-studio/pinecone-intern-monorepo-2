'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useHotelsQuery } from '@/generated';
import { Star } from 'lucide-react';
import Image from 'next/image';
import { FilterControls } from './FilterControls';
// eslint-disable-next-line complexity
const HotelRow = ({ hotel, index, onClick }: { hotel: any; index: number; onClick: () => void }) => (
  <tr className="border-t border-l border-r font-extralight hover:bg-gray-50 cursor-pointer transition-colors" onClick={onClick}>
    <td className="p-2 border">{index + 1}</td>
    <td className="p-2 flex items-center gap-2">
      <Image src={hotel.images?.[0] || 'https://via.placeholder.com/50'} alt={hotel.name || 'Hotel'} width={40} height={40} className="w-10 h-10 rounded object-cover" />
      {hotel.name || 'Unnamed Hotel'}
    </td>
    <td className="p-2 border">
      {hotel.city || 'Unknown City'}, {hotel.country || 'Unknown Country'}
    </td>
    <td className="p-2 border">
      <div className="flex items-center gap-2">
        <Star size={16} /> {hotel.stars || 0}
      </div>
    </td>
    <td className="p-2 border">{hotel.rating || 0}/10</td>
  </tr>
);

const HotelsTable = ({ hotels }: { hotels: any[] }) => {
  const router = useRouter();

  const handleHotelClick = (hotelId: string) => {
    router.push(`/admin/hotel/${hotelId}`);
  };

  return (
    <table className="w-full border bg-white rounded shadow">
      <thead>
        <tr className="text-left font-light">
          <th className="p-2 border">#</th>
          <th className="p-2 border">Name</th>
          <th className="p-2 border">Location</th>
          <th className="p-2 border">Stars Rating</th>
          <th className="p-2 border">User Rating</th>
        </tr>
      </thead>
      <tbody>
        {hotels.map((hotel, index) => (
          <HotelRow key={hotel.id} hotel={hotel} index={index} onClick={() => handleHotelClick(hotel.id)} />
        ))}
      </tbody>
    </table>
  );
};

const Tablecontainer = () => {
  const [location, setLocation] = useState<string>('');
  const [rooms, setRooms] = useState<string>('');
  const [starRating, setStarRating] = useState<string>('');
  const [userRating, setUserRating] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const { data, loading, error } = useHotelsQuery();

  const locationOptions = useMemo(() => {
    if (!data?.hotels) return [];

    const cities = [...new Set(data.hotels.map((hotel) => hotel.city).filter(Boolean))];
    return [
      { value: '', label: 'All Locations' },
      ...cities.map((city) => ({
        value: city.toLowerCase(),
        label: city,
      })),
    ];
  }, [data?.hotels]);

  const roomAmenities = {
    single: ['AIR_CONDITIONING'],
    double: ['AIR_CONDITIONING', 'WIFI'],
    deluxe: ['AIR_CONDITIONING', 'WIFI', 'ROOM_SERVICE'],
    suite: ['AIR_CONDITIONING', 'WIFI', 'ROOM_SERVICE', 'SPA'],
    family: ['AIR_CONDITIONING', 'WIFI', 'ROOM_SERVICE', 'POOL'],
    presidential: ['AIR_CONDITIONING', 'WIFI', 'ROOM_SERVICE', 'SPA', 'POOL', 'GYM'],
  } as const;

  const matchesSearchTerm = (hotel: any) => {
    return !searchTerm || (hotel.name && hotel.name.toLowerCase().includes(searchTerm.toLowerCase()));
  };

  const matchesLocation = (hotel: any) => {
    return !location || (hotel.city && hotel.city.toLowerCase() === location.toLowerCase());
  };

  const matchesStarRating = (hotel: any) => {
    return !starRating || hotel.stars >= parseInt(starRating);
  };

  const matchesUserRating = (hotel: any) => {
    if (!userRating) return true;
    const minRating = parseFloat(userRating.replace('+', ''));
    return hotel.rating >= minRating;
  };

  const matchesRoomType = (hotel: any) => {
    if (!rooms) return true;

    const requiredAmenities = roomAmenities[rooms as keyof typeof roomAmenities];

    return requiredAmenities.every((amenity) => hotel.amenities && hotel.amenities.some((hotelAmenity: string) => hotelAmenity === amenity));
  };

  const filteredHotels = useMemo(() => {
    if (!data?.hotels) return [];

    return data.hotels.filter((hotel) => {
      return matchesSearchTerm(hotel) && matchesLocation(hotel) && matchesStarRating(hotel) && matchesUserRating(hotel) && matchesRoomType(hotel);
    });
  }, [data?.hotels, searchTerm, location, rooms, starRating, userRating]);

  if (loading) {
    return <div className="p-4">Loading hotels...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error loading hotels: {error.message}</div>;
  }

  return (
    <div className="p-4 border-t flex space-x-2 flex-col">
      <FilterControls
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        location={location}
        setLocation={setLocation}
        rooms={rooms}
        setRooms={setRooms}
        starRating={starRating}
        setStarRating={setStarRating}
        userRating={userRating}
        setUserRating={setUserRating}
        locationOptions={locationOptions}
      />

      <HotelsTable hotels={filteredHotels} />

      {filteredHotels.length === 0 && <div className="text-center py-8 text-gray-500">No hotels found matching your criteria.</div>}
    </div>
  );
};

export default Tablecontainer;
