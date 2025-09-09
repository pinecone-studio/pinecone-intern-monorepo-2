import React from 'react';
import { BookingStatus, useGetRoomQuery } from '@/generated';

interface BookingInfoProps {
  hotelName: string;
  bookingStatus: BookingStatus;
  checkInDate: string;
  checkOutDate: string;
  adults?: number;
  childrens?: number;
  roomId: string;
  isBooked: boolean;
  onCancelClick: () => void;
}

/* eslint-disable-next-line */
export const BookingInfo = ({ hotelName, bookingStatus, checkInDate, checkOutDate, adults, childrens, roomId, isBooked, onCancelClick }: BookingInfoProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadgeClass = () => {
    if (bookingStatus === BookingStatus.Booked) {
      return 'bg-green-100 text-green-800';
    }
    if (bookingStatus === BookingStatus.Cancelled) {
      return 'bg-red-100 text-red-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  const { data: roomData } = useGetRoomQuery({
    skip: !roomId,
    variables: { getRoomId: roomId || '' },
  });
  const room = roomData?.getRoom;

  const getBedInfo = () => {
    if (room?.bedNumber) {
      return `${room.bedNumber} ${room.bedNumber === 1 ? 'bed' : 'beds'}`;
    }
    return '1 King Bed';
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">{hotelName}</h2>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass()}`}>{bookingStatus}</span>
      </div>

      {/* Check-in and Check-out */}
      <div className="space-y-3 mb-6">
        <div>
          <div className="text-sm text-gray-500 mb-1">Check-in</div>
          <div className="font-medium">{formatDate(checkInDate)}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500 mb-1">Check-out</div>
          <div className="font-medium">{formatDate(checkOutDate)}</div>
        </div>
      </div>

      {/* Room Information and Cancel Button */}
      <div className="mb-6">
        <div className="font-medium mb-2">{room?.name || ''}</div>
        <div className="text-sm text-gray-600 mb-2">{getBedInfo()}</div>
        {room?.pricePerNight && <div className="text-sm text-gray-600 mb-2">${room.pricePerNight} per night</div>}
        <div className="text-sm text-gray-600 mb-4">
          Reserved for {adults} {adults === 1 ? 'adult' : 'adults'}
          {childrens && childrens > 0 && (
            <span>
              , {childrens} {childrens === 1 ? 'child' : 'children'}
            </span>
          )}
        </div>
        {room?.roomInformation && room.roomInformation.length > 0 && (
          <div className="text-sm text-gray-600 mb-4">
            <div className="font-medium mb-1">Room Features:</div>
            <ul className="list-disc list-inside space-y-1">
              {room.roomInformation.map((info, index) => (
                <li key={index}>{info}</li>
              ))}
            </ul>
          </div>
        )}
        {isBooked && (
          <button onClick={onCancelClick} className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Cancel Booking
          </button>
        )}
      </div>
    </div>
  );
};
