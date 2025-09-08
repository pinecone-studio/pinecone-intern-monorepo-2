'use client';
import BookingsCard from './BookingsCard';
import RoomsCard from './RoomsCard';

interface RoomBookingTableProps {
  hotelId: string;
}

const RoomBookingTable = ({ hotelId }: RoomBookingTableProps) => {
  return (
    <div className="gap-10">
      <BookingsCard hotelId={hotelId} />
      <RoomsCard hotelId={hotelId} />
    </div>
  );
};

export default RoomBookingTable;
