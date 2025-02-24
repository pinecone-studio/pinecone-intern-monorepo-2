import Image from 'next/image';
import { BookingType } from './BookingDetailLeftSide';

const BookingDetailRightSide = ({ booking }: BookingType) => {
  return (
    <div className="md:max-w-[480px] w-full text-[#09090B]">
      <div className="w-full h-auto">
        {booking?.roomId?.hotelId?.images && (
          <Image src={booking?.roomId?.hotelId?.images[0] || '/'} className="object-cover w-full max-h-[400px] h-full rounded-t-md bg-slate-500" width={1000} height={1000} alt="image" />
        )}
      </div>
      <div className="flex flex-col gap-5 p-4 border rounded-b-md">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <div className="text-base">{booking?.roomId?.hotelId?.hotelName}</div>
            <div className="text-[#71717A] text-sm">Zaluuchuud Avenue, 18, Bayanzurkh, Ulaanbaatar, Ulaanbaatar, 001334</div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="bg-[#2563EB] w-[39px] h-[20px] text-center text-[#FAFAFA] rounded-full">{booking?.roomId?.hotelId?.userRating}</div>
            <HotelReveiwRating userRating={booking?.roomId?.hotelId?.userRating} />
          </div>
        </div>
        <div className="my-5 w-full bg-[#E4E4E7] h-[1px]"></div>
      </div>
    </div>
  );
};
export default BookingDetailRightSide;

export const HotelReveiwRating = ({ userRating }: { userRating: number | null | undefined }) => {
  if (userRating) {
    if (userRating >= 6) {
      return <div data-testid="Hotel-Review-Rating-Value1">Excellent</div>;
    } else {
      return <div data-testid="Hotel-Review-Rating-Value2">Bad</div>;
    }
  }
};
