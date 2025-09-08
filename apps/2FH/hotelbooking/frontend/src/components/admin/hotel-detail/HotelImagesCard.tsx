'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import Image from 'next/image';
import { EditHotelModal } from './EditHotelModal';

interface HotelImagesCardProps {
  hotel: any;
  editModalState: {
    isOpen: boolean;
    section: 'basic' | 'location' | 'amenities' | 'policies' | 'languages' | 'faq' | 'images' | 'details';
  };
  setEditModalState: (_state: { isOpen: boolean; section: 'basic' | 'location' | 'amenities' | 'policies' | 'languages' | 'faq' | 'images' | 'details' }) => void;
  refetch: () => Promise<any>;
  hotelId: string;
}

export const HotelImagesCard = ({ hotel, editModalState, setEditModalState, refetch, hotelId }: HotelImagesCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Hotel Images</CardTitle>
        <EditHotelModal
          hotel={hotel}
          section="images"
          isOpen={editModalState.isOpen && editModalState.section === 'images'}
          onOpenChange={(open) => setEditModalState({ isOpen: open, section: 'images' })}
          refetch={refetch}
          hotelId={hotelId}
        />
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setEditModalState({ isOpen: true, section: 'images' })}>
          Edit
        </Button>
      </CardHeader>
      <CardContent>
        {hotel.images && hotel.images.length > 0 ? (
          <div className="grid grid-cols-2 gap-4" data-testid="images-grid">
            {hotel.images.map((image: string, index: number) => (
              <div key={index} className="relative group" data-testid="hotel-image">
                <div className="relative h-48 rounded-lg overflow-hidden">
                  <Image src={image} alt={`${hotel.name} - Image ${index + 1}`} fill className="object-cover" />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setEditModalState({ isOpen: true, section: 'images' });
                        }}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1 text-center">Image {index + 1}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No images available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
