'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { Clock, Users, PawPrint } from 'lucide-react';
import { EditHotelModal } from './EditHotelModal';

interface PoliciesCardProps {
  hotel: any;
  editModalState: {
    isOpen: boolean;
    section: 'basic' | 'location' | 'amenities' | 'policies' | 'languages' | 'faq' | 'images' | 'details';
  };
  setEditModalState: (_state: { isOpen: boolean; section: 'basic' | 'location' | 'amenities' | 'policies' | 'languages' | 'faq' | 'images' | 'details' }) => void;
  refetch: () => Promise<any>;
  hotelId: string;
}

export const PoliciesCard = ({ hotel, editModalState, setEditModalState, refetch, hotelId }: PoliciesCardProps) => {
  if (!hotel.policies || hotel.policies.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Policies</CardTitle>
        <EditHotelModal
          hotel={hotel}
          section="policies"
          isOpen={editModalState.isOpen && editModalState.section === 'policies'}
          onOpenChange={(open) => setEditModalState({ isOpen: open, section: 'policies' })}
          refetch={refetch}
          hotelId={hotelId}
        />
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setEditModalState({ isOpen: true, section: 'policies' })}>
          Edit
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {hotel.policies.map((policy: any, index: number) => (
          <div key={index} className="space-y-3" data-testid={`policy-${index}`}>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-gray-500" />
              <span className="text-sm font-medium">Check-in: {policy.checkIn}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-gray-500" />
              <span className="text-sm font-medium">Check-out: {policy.checkOut}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} className="text-gray-500" />
              <span className="text-sm">{policy.childrenAndExtraBeds}</span>
            </div>
            <div className="flex items-center gap-2">
              <PawPrint size={16} className="text-gray-500" />
              <span className="text-sm">{policy.pets}</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="mt-1">
                <Clock size={16} className="text-gray-500" />
              </div>
              <div>
                <span className="text-sm font-medium">Special Check-in Instructions:</span>
                <p className="text-sm text-gray-600 mt-1">{policy.specialCheckInInstructions}</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
