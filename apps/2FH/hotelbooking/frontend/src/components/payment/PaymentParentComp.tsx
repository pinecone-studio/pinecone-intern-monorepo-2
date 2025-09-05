import { useOtpContext } from '../providers';
import { BookingPayment } from './_components/BookingPayment/BookingPayment';
import { ConfirmedBooking } from './_components/ConfirmedBooking/ConfirmedBooking';
import { RoomInformation } from './_components/RoomInformation';

export const PaymentParentComp = () => {
  const { bookingSuccess } = useOtpContext();
  return (
    <div data-testid='Payment-Parent-Comp' className="flex justify-center w-full">
      {bookingSuccess ? (
        <ConfirmedBooking />
      ) : (
        <div className="flex gap-16 justify-between w-[1280px] px-7 py-5">
          <BookingPayment />
          <RoomInformation />
        </div>
      )}
    </div>
  );
};
