import { TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BookingsType } from '@/generated';

const DataTable = ({ bookingsData }: { bookingsData: BookingsType }) => {
  return (
    <div key={bookingsData._id} data-cy="Bookings-Data-Table-Component">
      <TableRow className="flex gap-4 border">
        <TableCell className="border-r-[1px] py-3 px-4 w-[50px]">{bookingsData._id?.slice(0, 3)}</TableCell>
        <TableCell className="border-r-[1px] flex-1">{bookingsData.userId?.firstName && bookingsData.userId.lastName && `${bookingsData.userId.firstName} ${bookingsData.userId.lastName}`}</TableCell>
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
          <Badge className={`bg-blue-600 w-24 flex justify-center items-center ${bookingsData.status === 'booked' ? 'bg-lime-600' : 'bg-blue-600'}`}>{bookingsData.status}</Badge>
        </TableCell>
      </TableRow>
    </div>
  );
};
export default DataTable;
