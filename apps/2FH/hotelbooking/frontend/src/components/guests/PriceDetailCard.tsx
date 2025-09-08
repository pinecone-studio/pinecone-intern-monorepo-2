'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GetRoomQuery } from '@/generated';

type RoomData = Pick<GetRoomQuery['getRoom'], 'pricePerNight'>;

interface PriceDetailCardProps {
  room: RoomData | undefined;
}

const PriceDetailCard = ({ room }: PriceDetailCardProps) => {
  const roomPrice = room?.pricePerNight !== undefined && room?.pricePerNight !== null ? (isNaN(Number(room.pricePerNight)) ? 150000 : Number(room.pricePerNight)) : 150000;
  const taxAmount = Math.round(roomPrice * 0.08); // 8% tax
  const totalPrice = roomPrice + taxAmount;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Price Detail</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-900">1 night</p>
              <p className="text-sm text-gray-500">{roomPrice.toLocaleString()}₮ per night</p>
            </div>
            <p className="text-gray-900 font-medium">{roomPrice.toLocaleString()}₮</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-900">Taxes</p>
            <p className="text-gray-900">{taxAmount.toLocaleString()}₮</p>
          </div>
          <div className="border-t pt-3">
            <div className="flex justify-between">
              <p className="text-gray-900 font-semibold">Total price</p>
              <p className="text-gray-900 font-bold">{totalPrice.toLocaleString()}₮</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceDetailCard;
