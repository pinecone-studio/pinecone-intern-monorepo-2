'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { Wifi, WavesLadder, Droplet, Beef, Car, Dumbbell } from 'lucide-react';
import { EditHotelModal } from './EditHotelModal';

interface AmenitiesCardProps {
  hotel: any;
  editModalState: {
    isOpen: boolean;
    section: 'basic' | 'location' | 'amenities' | 'policies' | 'languages' | 'faq' | 'images' | 'details';
  };
  setEditModalState: (_state: { isOpen: boolean; section: 'basic' | 'location' | 'amenities' | 'policies' | 'languages' | 'faq' | 'images' | 'details' }) => void;
  refetch: () => Promise<any>;
  hotelId: string;
}

export const AmenitiesCard = ({ hotel, editModalState, setEditModalState, refetch, hotelId }: AmenitiesCardProps) => {
  const getAmenityIcon = (amenity: string) => {
    const iconMap: Record<string, React.ReactElement> = {
      WIFI: <Wifi size={16} />,
      POOL: <WavesLadder size={16} />,
      SPA: <Droplet size={16} />,
      RESTAURANT: <Beef size={16} />,
      PARKING: <Car size={16} />,
      GYM: <Dumbbell size={16} />,
    };

    return iconMap[amenity] || null;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Amenities</CardTitle>
        <EditHotelModal
          hotel={hotel}
          section="amenities"
          isOpen={editModalState.isOpen && editModalState.section === 'amenities'}
          onOpenChange={(open) => setEditModalState({ isOpen: open, section: 'amenities' })}
          refetch={refetch}
          hotelId={hotelId}
        />
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setEditModalState({ isOpen: true, section: 'amenities' })}>
          Edit
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {hotel.amenities?.map((amenity: string) => (
            <div key={amenity} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
              {getAmenityIcon(amenity)}
              <span className="text-sm">{amenity.replace(/_/g, ' ')}</span>
            </div>
          )) || <div className="text-gray-500 text-sm">No amenities available</div>}
        </div>
      </CardContent>
    </Card>
  );
};
