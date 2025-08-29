'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';

import { MapPin, Phone } from 'lucide-react';
import { EditHotelModal } from './EditHotelModal';

interface LocationCardProps {
  hotel: any;
  editModalState: {
    isOpen: boolean;
    section: 'basic' | 'location' | 'amenities' | 'policies' | 'languages' | 'faq' | 'images' | 'details';
  };
  setEditModalState: (_state: { isOpen: boolean; section: 'basic' | 'location' | 'amenities' | 'policies' | 'languages' | 'faq' | 'images' | 'details' }) => void;
  refetch: () => Promise<any>;
  hotelId: string;
}

export const LocationCard = ({ hotel, editModalState, setEditModalState, refetch, hotelId }: LocationCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Detailed Location</CardTitle>
        <EditHotelModal
          hotel={hotel}
          section="location"
          isOpen={editModalState.isOpen && editModalState.section === 'location'}
          onOpenChange={(open) => setEditModalState({ isOpen: open, section: 'location' })}
          refetch={refetch}
          hotelId={hotelId}
        />
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setEditModalState({ isOpen: true, section: 'location' })}>
          Edit
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <MapPin size={20} className="text-gray-500 mt-0.5" />
          <div>
            <h4 className="font-medium text-gray-900">{hotel.name}</h4>
            <p className="text-gray-600">{hotel.location}</p>
            <p className="text-gray-600" data-testid="city-country">
              {hotel.city}, {hotel.country}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Phone size={16} className="text-gray-500" />
          <span className="text-sm text-gray-600">{hotel.phone}</span>
        </div>
      </CardContent>
    </Card>
  );
};
