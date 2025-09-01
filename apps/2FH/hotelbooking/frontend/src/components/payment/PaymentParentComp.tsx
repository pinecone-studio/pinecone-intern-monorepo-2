import { useOtpContext } from '../providers';
import { BookingPayment } from './_components/BookingPayment';
import { ConfirmedBooking } from './_components/ConfirmedBooking/ConfirmedBooking';
import { RoomInformation } from './_components/RoomInformation';

export const PaymentParentComp = () => {
  const { bookingSuccess } = useOtpContext();
  return (
    <>
      {bookingSuccess ? (
        <ConfirmedBooking />
      ) : (
        <div className="flex gap-16 justify-between w-[1280px] px-7 py-5">
          <BookingPayment />
          <RoomInformation />
        </div>
      )}
    </>
  );
};
