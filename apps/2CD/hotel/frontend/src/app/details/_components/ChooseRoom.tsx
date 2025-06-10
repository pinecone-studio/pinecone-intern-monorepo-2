import { useGetRoomForIdQuery } from '@/generated';
import { RoomCard } from './RoomCards';

export const ChooseRoom = () => {
  const { data, loading, error } = useGetRoomForIdQuery();
  if (loading) return <p>loading</p>;
  if (error) return <p>Error loading: {error.message}</p>;

  return (
    <div className="w-full max-w-[1080px] inline-flex flex-col gap-y-4">
      <h1 className="font-bold text-2xl">Choose your Room</h1>
      <div className="flex w-full gap-4 mb-10">
        <div className="w-full">
          <p>dates</p>
     
        </div>
        <div className="w-full">
          {' '}
          <p>Travels</p>
          <input className="w-full border rounded-sm p-2" type="date" />
        </div>
      </div>
      <div>
        <div className="w-[420px] h-[30px] flex gap-2 p-[4px] bg-[#F4F4F5] rounded-md">
          <button className="bg-white w-full rounded-md">All rooms</button>
          <button className="bg-[#F4F4F5] w-full rounded-md text-[#71717A]">1 bed</button>
          <button className="bg-[#F4F4F5] w-full rounded-md text-[#71717A]">2 bed</button>
          <button className="bg-[#F4F4F5] w-full rounded-md text-[#71717A]">3 bed</button>
          <button className="bg-[#F4F4F5] w-full rounded-md text-[#71717A]">4 bed</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {data?.getAllRooms.map((room) => (
            <div key={room.id}>
              <RoomCard room={room} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
