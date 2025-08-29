import { BookingPayment } from '@/components/payment/_components/BookingPayment';
import { BookingSuccess } from '@/components/payment/_components/BookingSuccess';
import { RoomInformation } from '@/components/payment/_components/RoomInformation';

const Booking = () => {
  return (
    <div className="flex gap-16 justify-between w-[1280px] px-7 py-5">
      <BookingPayment />
      <RoomInformation />
    </div>
  );
};

export default Booking;
