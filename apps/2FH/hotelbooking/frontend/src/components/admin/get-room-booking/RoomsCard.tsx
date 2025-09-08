/* eslint-disable  */
'use client';
import { useGetRoomsQuery } from '@/generated';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Bed, Users, Eye } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface RoomsCardProps {
  hotelId: string;
}

const RoomsCard = ({ hotelId }: RoomsCardProps) => {
  const router = useRouter();

  const {
    data: roomsData,
    loading,
    error,
  } = useGetRoomsQuery({
    variables: { hotelId },
  });

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rooms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Rooms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-600">Error loading rooms: {error.message}</div>
        </CardContent>
      </Card>
    );
  }

  const rooms = roomsData?.getRooms || [];

  const handleViewRoom = (roomId: string) => {
    router.push(`/admin/room/${roomId}`);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Rooms</CardTitle>
          <Button variant="outline" size="sm" onClick={() => router.push(`/admin/add-room`)}>
            Add Room
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {rooms.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No rooms found</div>
        ) : (
          <div className="space-y-4">
            {rooms.slice(0, 5).map((room) => (
              <div key={room.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => handleViewRoom(room.id)}>
                <div className="flex-1">
                  <div className="font-medium mb-2">{room.name}</div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Bed className="h-4 w-4" />
                      {room.bedNumber || 'N/A'} Beds
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {room.typePerson || 'N/A'} People
                    </div>
                    <div className="flex items-center gap-1">{room.pricePerNight || 0}MNT/night</div>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{rooms.length}</div>
            <div className="text-sm text-gray-600">Total Rooms</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{Math.round(rooms.reduce((sum, room) => sum + (room.pricePerNight || 0), 0) / rooms.length) || 0}</div>
            <div className="text-sm text-gray-600">Avg Price</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoomsCard;
