'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import RoomPhotosModal from './RoomPhotosModal';

type RoomData = {
  name?: string;
  imageURL?: string | (string | null)[];
};

interface RoomDetailsCardProps {
  room: RoomData | undefined;
  booking: {
    roomId: string;
  };
}

const RoomDetailsCard = ({ room, booking }: RoomDetailsCardProps) => {
  const roomName = room?.name || `Room ${booking.roomId.slice(-8)}`;

  const getRoomImages = (room: RoomData | undefined): string[] => {
    if (!room?.imageURL) return [];

    // Handle both string and array types for backward compatibility
    if (typeof room.imageURL === 'string') {
      return room.imageURL ? [room.imageURL] : [];
    }

    return room.imageURL.filter((img): img is string => img !== null && img !== undefined && img !== '');
  };

  const roomImages = getRoomImages(room);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{roomName}</CardTitle>
          <RoomPhotosModal roomImages={roomImages} roomName={roomName} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative h-48 w-full rounded-lg overflow-hidden">
          <Image
            src={typeof room?.imageURL === 'string' ? room.imageURL : room?.imageURL?.[0] || '/placeholder-room.jpg'}
            alt={roomName}
            fill
            className="object-cover"
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
              // Fallback to a placeholder image
              e.currentTarget.src = '/placeholder-room.jpg';
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default RoomDetailsCard;
