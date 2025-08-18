import { ChevronLeft } from 'lucide-react';
import { General, Upcoming } from '@/components/room';

const Home = () => {
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex gap-x-4">
        <div className=" flex gap-x-4 w-8 h-8 border solid rounded-md justify-center items-center ">
          <ChevronLeft />
        </div>
        <p className="text-lg font-semibold">Economy Single Room</p>
      </div>

      <General />
      <Upcoming />
    </div>
  );
};

export default Home;
