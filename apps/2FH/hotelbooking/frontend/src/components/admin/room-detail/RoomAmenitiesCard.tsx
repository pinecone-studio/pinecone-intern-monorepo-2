'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wifi, Utensils, Bed, Accessibility, Gamepad2, Coffee } from 'lucide-react';
import { EditRoomModal } from './EditRoomModal';

interface RoomAmenitiesCardProps {
  room: any;
  editModalState: {
    isOpen: boolean;
    section: 'basic' | 'amenities' | 'images' | 'details';
  };
  setEditModalState: (_state: { isOpen: boolean; section: 'basic' | 'amenities' | 'images' | 'details' }) => void;
  refetch: () => Promise<any>;
  roomId: string;
}

export const RoomAmenitiesCard = ({ room, editModalState, setEditModalState, refetch, roomId }: RoomAmenitiesCardProps) => {
  // Create a comprehensive list of all amenities with their values and labels
  const getAllAmenities = () => {
    const amenityCategories = [
      { key: 'internet', label: 'Internet', icon: <Wifi className="h-4 w-4" /> },
      { key: 'foodAndDrink', label: 'Food & Drink', icon: <Utensils className="h-4 w-4" /> },
      { key: 'bedRoom', label: 'Bedroom', icon: <Bed className="h-4 w-4" /> },
      { key: 'bathroom', label: 'Bathroom', icon: <Coffee className="h-4 w-4" /> },
      { key: 'accessibility', label: 'Accessibility', icon: <Accessibility className="h-4 w-4" /> },
      { key: 'entertainment', label: 'Entertainment', icon: <Gamepad2 className="h-4 w-4" /> },
      { key: 'other', label: 'Other', icon: <Coffee className="h-4 w-4" /> },
    ];

    const allAmenities: any[] = [];

    amenityCategories.forEach((category) => {
      const categoryValue = room[category.key];
      if (categoryValue) {
        // Handle both single values and arrays
        const values = Array.isArray(categoryValue) ? categoryValue : [categoryValue];
        values.forEach((value: string) => {
          if (value) {
            allAmenities.push({
              key: `${category.key}-${value}`,
              category: category.label,
              value: value,
              icon: category.icon,
            });
          }
        });
      }
    });

    return allAmenities;
  };

  const amenities = getAllAmenities();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Room Amenities</CardTitle>
        <EditRoomModal
          room={room}
          section="amenities"
          isOpen={editModalState.isOpen && editModalState.section === 'amenities'}
          onOpenChange={(open) => setEditModalState({ isOpen: open, section: 'amenities' })}
          refetch={refetch}
          roomId={roomId}
        />
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setEditModalState({ isOpen: true, section: 'amenities' })}>
          Edit
        </Button>
      </CardHeader>
      <CardContent>
        {amenities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No amenities configured for this room</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {amenities.map((amenity) => (
              <div key={amenity.key} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="text-blue-600">{amenity.icon}</div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{amenity.value.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}</div>
                  <div className="text-sm text-gray-600">{amenity.category}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
