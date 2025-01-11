import { Button } from '@/components/ui/button';
import { Table, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RoomType } from '@/generated';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const RoomTypes = ({ rooms, setRoomOpen }: { rooms: RoomType[] | undefined; setRoomOpen: (_value: boolean) => void }) => {
  return (
    <div className="bg-[#FFFFFF] p-6 flex flex-col gap-4">
      <div className="text-[#09090B] flex justify-between mb-4">
        <div className="text-lg text-foreground">Room Types</div>
        <Button
          data-testid="Add-Room-General-Info-Dialog"
          data-cy="Add-Room-General-Info-Dialog"
          className="flex gap-2 text-blue-400 bg-white border hover:bg-slate-100 active:bg-slate-200"
          onClick={() => setRoomOpen(true)}
        >
          <Plus />
          <div>Add Room</div>
        </Button>
      </div>
      <div className="flex text-black bg-[#F4F4F5] rounded-md max-w-[250px] p-2 whitespace-nowrap hover:cursor-pointer">
        <div className="px-3 py-1 rounded-lg hover:bg-white active:bg-white">All Rooms</div>
        <div className="px-3 py-1 rounded-lg hover:bg-white active:bg-white">1 bed</div>
        <div className="px-3 py-1 rounded-lg hover:bg-white active:bg-white">2 bed</div>
      </div>
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
            {rooms?.map((room) => (
              <Link key={room._id} href={`/room-detail/${room._id}`}>
                <TableRow className="flex items-center gap-4 border">
                  <TableCell className="flex w-[50px] h-16 px-4 py-3 text-black border-r-[1px]">{room._id?.slice(5, 8)}</TableCell>
                  <TableCell className="flex flex-1 p-4 border-r-[1px] h-16 items-center gap-2">
                    {room?.images?.[0] && <Image src={room.images[0]} alt="image" width={2000} height={2000} className="object-cover w-12 h-12 rounded-sm" />}
                    <div>{room.roomName}</div>
                  </TableCell>
                  <TableCell className="flex h-16  p-4 flex-1 gap-2  text-black border-r-[1px]">{room.price}</TableCell>
                  <TableCell className="flex flex-1 w-40 h-16 p-4 text-black">{room.roomType}</TableCell>
                </TableRow>
              </Link>
            ))}
          </TableHeader>
        </Table>
      </div>
    </div>
  );
};
export default RoomTypes;
