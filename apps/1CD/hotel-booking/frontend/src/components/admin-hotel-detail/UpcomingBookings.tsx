import { Table, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BookingsType } from '@/generated';
import { differenceInCalendarDays, format } from 'date-fns';

const UpcomingBookings = ({ bookings }: { bookings: BookingsType[] | undefined }) => {
  return (
    <div className="bg-[#FFFFFF] p-6">
      <div className="text-[#09090B] text-foreground text-lg mb-4">Upcoming Bookings</div>
      <div>
        <Table className="w-full bg-white rounded-md">
          <TableHeader className="rounded-xl">
            <TableRow className="flex items-center gap-4 border">
              <TableHead className="flex w-[50px] items-center h-6 px-4 py-3 font-semibold text-black border-r-[1px]">ID</TableHead>
              <TableHead className="flex flex-1 items-center border-r-[1px] h-9  font-semibold text-black">Guest</TableHead>
              <TableHead className="flex items-center flex-1 font-semibold border-r-[1px] text-black h-9">Date</TableHead>
              <TableHead className="flex items-center flex-1 w-40 h-8 font-semibold text-black">Rooms</TableHead>
            </TableRow>
          </TableHeader>
          <TableHeader className="rounded-xl max-h-[400px] overflow-y-scroll">
            {bookings?.map((booking) => (
              <TableRow className="flex items-center gap-4 border" key={booking._id}>
                <TableHead className="flex w-[50px] p-4 items-center text-black border-r-[1px]">{booking._id?.slice(5, 8)}</TableHead>
                <TableHead className="flex flex-1 p-4 items-center border-r-[1px]">{booking.firstName}</TableHead>
                <TableHead className="flex items-center p-4 flex-1 gap-2 text-black border-r-[1px] justify-center">
                  <div className="">{format(booking.checkInDate, 'MMM dd')}</div>
                  <div>-</div>
                  <div className="flex gap-2">
                    <div className=""> {format(booking.checkOutDate, 'MMM dd')}</div>
                    <div className="text-[#71717A] text-muted-foreground">({differenceInCalendarDays(booking.checkOutDate, booking.checkInDate)} night)</div>
                  </div>
                </TableHead>
                <TableHead className="flex items-center flex-1 w-40 p-4 text-black">{booking.roomId?.roomName}</TableHead>
              </TableRow>
            ))}
          </TableHeader>
        </Table>
      </div>
    </div>
  );
};
export default UpcomingBookings;
