'use client';

import { useCreateRoomMutation } from '@/generated';
import { useState } from 'react';
import { handleFinalSave } from './SaveHandlerUtils';

interface FormData {
  name: string;
  type: string[];
  pricePerNight: string;
  roomInformation: string[];
  bedNumber: number;
}

interface ServiceData {
  bathroom: string[];
  accessibility: string[];
  entertainment: string[];
  foodAndDrink: string[];
  other: string[];
  internet: string[];
  bedRoom: string[];
}

interface RoomData {
  general: FormData;
  services: ServiceData;
  images: string[];
}

interface SaveHandlerProps {
  selectedHotelId: string;
  roomData: RoomData;
  setRoomData: (_data: RoomData) => void;
  loading: boolean;
}

// eslint-disable-next-line complexity
export const SaveHandler = (props: SaveHandlerProps) => {
  const [createRoom] = useCreateRoomMutation();
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    props.setRoomData({
      general: { name: '', type: [], pricePerNight: '', roomInformation: [], bedNumber: 0 },
      services: { bathroom: [], accessibility: [], entertainment: [], internet: [], foodAndDrink: [], bedRoom: [], other: [] },
      images: [],
    });
  };

  const handleClick = () => {
    console.log('Button clicked, selectedHotelId:', props.selectedHotelId);

    // Add validation checks here
    if (!props.selectedHotelId || !props.roomData.general.name || props.roomData.general.name === '') {
      console.warn('Please fill in the required information');
      return;
    }

    handleFinalSave(props.selectedHotelId, props.roomData, createRoom, setIsLoading, resetForm);
  };

  const isDisabled = isLoading || !props.selectedHotelId;
  const buttonClass = isDisabled ? 'bg-gray-400 text-gray-200 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700';
  const buttonText = isLoading ? 'Creating Room...' : 'Create Room';

  return (
    <div className="flex justify-center mt-6">
      <button
        data-cy="Create-Room"
        onClick={handleClick}
        disabled={isDisabled}
        className={`px-6 py-3 rounded-md font-medium transition-colors ${buttonClass}`}
        data-testid="create-room-btn"
        style={{
          pointerEvents: 'auto',
          opacity: isDisabled ? 0.5 : 1,
        }}
      >
        {buttonText}
      </button>
    </div>
  );
};
