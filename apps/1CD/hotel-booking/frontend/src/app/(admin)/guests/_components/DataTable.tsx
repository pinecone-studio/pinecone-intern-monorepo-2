import { TableRow, TableCell } from '@/components/ui/table';
import { BookingsType } from '@/generated';
import BookingStatusBadge from '@/components/BookingStatusBadge';

const DataTable = ({ bookingsData }: { bookingsData: BookingsType }) => {
  return (
    <div key={bookingsData._id} data-cy="Bookings-Data-Table-Component" className='h-full'>
      <TableRow className="flex gap-4 border">
        <TableCell className="border-r-[1px] py-3 px-4 w-[50px]">{bookingsData._id?.slice(0, 3)}</TableCell>
        <TableCell className="border-r-[1px] flex-1">{showName({ firstName: bookingsData?.firstName, lastName: bookingsData?.lastName, email: bookingsData?.email })}</TableCell>
        <TableCell className="border-r-[1px] flex-1 ">{bookingsData.roomId?.hotelId?.hotelName}</TableCell>
        <TableCell className="border-r-[1px] flex-1">{bookingsData.roomId?.roomName}</TableCell>
        <TableCell className="border-r-[1px] flex-1">{bookingsData.roomId?.roomType}</TableCell>
        <TableCell className="border-r-[1px] flex-1 flex items-center gap-2">
          {bookingsData.checkInDate && (
            <>
              <p>{new Date(bookingsData.checkInDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p> -
              <p>{new Date(bookingsData.checkOutDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
            </>
          )}
        </TableCell>

        <TableCell className="flex-1 h-8">
          <BookingStatusBadge status={bookingsData.status} />
        </TableCell>
      </TableRow>
    </div>
  );
};
export default DataTable;

const showName = ({ firstName, lastName, email }: { firstName: string | undefined | null; lastName: string | null | undefined; email: string | null | undefined }) => {
  if (firstName) return firstName;
  if (lastName) return lastName;
  return email?.split('@')[0];
};
