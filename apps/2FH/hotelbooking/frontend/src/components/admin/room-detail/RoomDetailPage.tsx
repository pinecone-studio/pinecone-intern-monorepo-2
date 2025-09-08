'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useGetRoomQuery } from '@/generated';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { RoomInfoCard, RoomAmenitiesCard, RoomImagesCard, LoadingSkeleton, ErrorMessage, NotFoundMessage } from '@/components/admin/room-detail';

export const RoomDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const roomId = params.id as string;

  const [editModalState, setEditModalState] = useState<{
    isOpen: boolean;
    section: 'basic' | 'amenities' | 'images' | 'details';
  }>({
    isOpen: false,
    section: 'basic',
  });

  const { data, loading, error, refetch } = useGetRoomQuery({
    variables: { getRoomId: roomId },
  });

  if (loading) {
    return <LoadingSkeleton data-cy="RoomDetail-Loading" />;
  }

  if (error) {
    return <ErrorMessage data-cy="RoomDetail-Error" message={error.message} />;
  }

  if (!data?.getRoom) {
    return <NotFoundMessage data-cy="RoomDetail-NotFound" />;
  }

  const room = {
    ...data.getRoom,
    status: 'available', // Default status since we're not fetching it from GraphQL
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6" data-cy="RoomDetail-Page">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8" data-cy="RoomDetail-Header">
          <Button variant="outline" onClick={() => router.back()} className="flex items-center gap-2" data-cy="RoomDetail-BackButton">
            <ArrowLeft size={16} />
            Back
          </Button>
          <div data-cy="RoomDetail-Title">
            <h1 className="text-3xl font-bold text-gray-900">{room.name}</h1>
            <div className="flex items-center gap-2 text-gray-600" data-cy="RoomDetail-Price">
              <span>
                ${room.pricePerNight}/night • {room.typePerson} People
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Side - Information Sections */}
          <div className="space-y-6">
            <RoomInfoCard data-cy="RoomInfoCard" room={room} editModalState={editModalState} setEditModalState={setEditModalState} refetch={refetch} roomId={roomId} />
            <RoomAmenitiesCard data-cy="RoomAmenitiesCard" room={room} editModalState={editModalState} setEditModalState={setEditModalState} refetch={refetch} roomId={roomId} />
          </div>

          {/* Right Side - Images */}
          <div className="space-y-6">
            <RoomImagesCard data-cy="RoomImagesCard" room={room} editModalState={editModalState} setEditModalState={setEditModalState} refetch={refetch} roomId={roomId} />
          </div>
        </div>
      </div>
    </div>
  );
};
