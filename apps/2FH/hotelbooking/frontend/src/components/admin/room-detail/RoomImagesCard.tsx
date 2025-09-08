/* eslint-disable  */
'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Image as ImageIcon, Plus } from 'lucide-react';
import { EditRoomModal } from './EditRoomModal';

interface RoomImagesCardProps {
  room: any;
  editModalState: {
    isOpen: boolean;
    section: 'basic' | 'amenities' | 'images' | 'details';
  };
  setEditModalState: (_state: { isOpen: boolean; section: 'basic' | 'amenities' | 'images' | 'details' }) => void;
  refetch: () => Promise<any>;
  roomId: string;
}

export const RoomImagesCard = ({ room, editModalState, setEditModalState, refetch, roomId }: RoomImagesCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Room Images</CardTitle>
        <EditRoomModal
          room={room}
          section="images"
          isOpen={editModalState.isOpen && editModalState.section === 'images'}
          onOpenChange={(open) => setEditModalState({ isOpen: open, section: 'images' })}
          refetch={refetch}
          roomId={roomId}
        />
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setEditModalState({ isOpen: true, section: 'images' })}>
          Edit
        </Button>
      </CardHeader>
      <CardContent>
        {room.imageURL && Array.isArray(room.imageURL) && room.imageURL.length > 0 ? (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 mb-3">
              {room.imageURL.filter((img: string): img is string => img !== null && img !== undefined && img !== '').length} image
              {room.imageURL.filter((img: string): img is string => img !== null && img !== undefined && img !== '').length !== 1 ? 's' : ''} uploaded
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {room.imageURL
                .filter((img: string): img is string => img !== null && img !== undefined && img !== '')
                .map((imageUrl: string, index: number) => (
                  <div key={index} className="relative group">
                    <div className="aspect-video rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                      <img
                        src={imageUrl}
                        alt={`${room.name} - Image ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center text-gray-400">
                              <div class="text-center">
                                <svg class="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                <p class="text-xs">Failed to load</p>
                              </div>
                            </div>
                          `;
                          }
                        }}
                      />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity">Image {index + 1}</div>
                  </div>
                ))}
            </div>
          </div>
        ) : room.imageURL && typeof room.imageURL === 'string' ? (
          <div className="space-y-4">
            <div className="relative">
              <img
                src={room.imageURL}
                alt={room.name}
                className="w-full h-64 object-cover rounded-lg border"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
            <div className="text-sm text-gray-600">Room image</div>
          </div>
        ) : (
          <div className="text-center py-12">
            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No images uploaded for this room</p>
            <Button variant="outline" onClick={() => setEditModalState({ isOpen: true, section: 'images' })}>
              <Plus className="h-4 w-4 mr-2" />
              Add Images
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
