'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft } from 'lucide-react';
import { useHotelsQuery, useCreateRoomMutation } from '@/generated';
import { General } from './General';
import { Upcoming } from './Upcoming';
import { Roomservice } from './Roomservice';
import { ImageModal } from './ImageModal';
import { SaveHandler } from './SaveHandler';

export const RoomPage = () => {
  const [selectedHotelId, setSelectedHotelId] = useState<string>('');
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [roomImages, setRoomImages] = useState<string[]>([]);
  const [roomData, setRoomData] = useState({
    general: {
      name: '',
      type: [] as string[],
      pricePerNight: '',
      roomInformation: [] as string[],
      bedNumber: 0,
      status: 'available', // This should match the Status enum value
    },
    services: {
      bathroom: [] as string[],
      accessibility: [] as string[],
      entertainment: [] as string[],
      foodAndDrink: [] as string[],
      other: [] as string[],
      internet: [] as string[],
      bedRoom: [] as string[],
    },
    images: [] as string[],
  });
  const { data: hotelsData, loading: hotelsLoading, error: hotelsError } = useHotelsQuery();
  const [, { loading: createRoomLoading }] = useCreateRoomMutation();
  const handleImageSave = (images: string[]) => {
    console.log('handleImageSave called with images:', images);
    setRoomImages(images);
    setRoomData((prev) => {
      const updated = { ...prev, images };
      return updated;
    });
    setIsImageModalOpen(false);
  };
  const handleOpenImageModal = () => {
    setIsImageModalOpen(true);
  };
  const handleGeneralSave = (data: typeof roomData.general) => {
    setRoomData((prev) => ({ ...prev, general: data }));
  };
  const handleServiceSave = (data: typeof roomData.services) => {
    setRoomData((prev) => ({ ...prev, services: data }));
  };
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button data-cy="Chevron-Left" className="flex items-center justify-center w-8 h-8 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 mb-6">
          <h1 data-cy="Room-Name" className="text-xl font-semibold text-gray-900 mb-2">
            {roomData.general.name || 'New Room'}
          </h1>
          <input
            type="text"
            value={roomData.general.name}
            onChange={(e) => {
              setRoomData((prev) => ({
                ...prev,
                general: { ...prev.general, name: e.target.value },
              }));
            }}
            placeholder="Enter room name"
            className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
        <div className="mb-6">
          <label data-cy="Select-Hotel" className="block text-sm font-medium text-gray-700 mb-2">
            Select Hotel
          </label>
          <select
            data-cy="Select-Hotel-Option"
            value={selectedHotelId}
            onChange={(e) => setSelectedHotelId(e.target.value)}
            className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={hotelsLoading}
          >
            <option value="">Select a hotel</option>
            {hotelsData?.hotels.map((hotel) => (
              <option key={hotel.id} value={hotel.id}>
                {hotel.name}
              </option>
            ))}
          </select>
          {hotelsError && <p className="text-red-500 text-sm mt-1">Error loading hotels: {hotelsError.message}</p>}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <General onSave={handleGeneralSave} loading={createRoomLoading} _onImageSave={() => undefined} _data={roomData.general} />
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Images</h2>
              <button data-cy="Edit-Images" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium" onClick={handleOpenImageModal}>
                Edit
              </button>
            </div>
            {roomImages.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {roomImages.map((image, index) => (
                  <div key={index} className="relative">
                    {image && <Image src={image} alt={`Room image ${index + 1}`} width={200} height={128} className="w-full h-32 object-cover rounded-md" />}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-base font-medium text-gray-900 mb-2">No Photos Uploaded</h3>
                <p className="text-sm text-gray-500 text-center max-w-xs">Add photos of your rooms, amenities, or property to showcase your hotel.</p>
              </div>
            )}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <Upcoming />
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <Roomservice onSave={handleServiceSave} loading={createRoomLoading} _data={roomData.services} />
        </div>
        <SaveHandler selectedHotelId={selectedHotelId} roomData={roomData} setRoomData={setRoomData} loading={createRoomLoading} />
        <ImageModal isOpen={isImageModalOpen} onClose={() => setIsImageModalOpen(false)} onSave={handleImageSave} />
      </div>
    </div>
  );
};
