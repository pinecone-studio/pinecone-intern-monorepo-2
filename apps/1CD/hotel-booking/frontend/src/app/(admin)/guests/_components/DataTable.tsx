import { Table, TableHeader, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BookingType } from '@/generated';

const DataTable = ({ bookingsData }: { bookingsData: BookingType }) => {
  return (
    <div key={bookingsData._id}>
      <Table className="max-w-[1600px] bg-white">
        <TableHeader className="rounded-xl">
          <TableRow className="flex items-center gap-4 border">
            <TableHead className="flex items-center h-6 pl-5 font-semibold text-black border-r-[1px] w-28">ID</TableHead>
            <TableHead className="flex items-center border-r-[1px] h-9 w-60 font-semibold text-black">Name</TableHead>
            <TableHead className="flex items-center border-r-[1px] h-9 w-60 font-semibold text-black">Hotel</TableHead>
            <TableHead className="flex items-center border-r-[1px] h-9 w-60 font-semibold text-black">Rooms</TableHead>
            <TableHead className="flex items-center border-r-[1px] h-9 w-60 font-semibold text-black">Guests</TableHead>
            <TableHead className="flex items-center border-r-[1px] h-9 w-60 font-semibold text-black">Date</TableHead>
            <TableHead className="flex items-center w-40 h-8 font-semibold text-black">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableRow className="flex gap-4 border">
          <TableCell className="border-r-[1px] w-28"></TableCell>
          <TableCell className="border-r-[1px] w-60">idk</TableCell>
          <TableCell className="border-r-[1px] w-60">idk</TableCell>
          <TableCell className="border-r-[1px] w-60">Guests</TableCell>
          <TableCell className="border-r-[1px] w-60">Guests</TableCell>
          <TableCell className="border-r-[1px] w-60">Guests</TableCell>
          <TableCell className="w-40 h-8">
            <Badge className={`bg-blue-600 ${bookingsData.status === 'booked' ? 'bg-lime-600' : 'bg-blue-600'}`}>{bookingsData.status}</Badge>
          </TableCell>
        </TableRow>
      </Table>
    </div>
  );
};
export default DataTable;
