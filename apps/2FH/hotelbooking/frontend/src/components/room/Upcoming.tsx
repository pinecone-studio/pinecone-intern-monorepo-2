import { RotateCcw } from 'lucide-react';
import { ChevronsUpDown } from 'lucide-react';

export const Upcoming = () => {
  return (
    <div className="w-[784px] h-[288px] px-6 py-6 border border-solid rounded-lg flex flex-col gap-y-6">
      <h3 className="font-semibold text-lg">Upcoming Bookings</h3>
      <div className="border border-solid">
        <div className="h-[40px]  border border-solid bg-[#F4F4F5] flex rounded-md">
          <h3 className="text-sm font-semibold  w-[82px]  py-4 px-2 border-r">ID</h3>
          <h3 className="text-sm font-semibold  w-[346px]  py-4 px-2 border-r">Guest name</h3>
          <h3 className="text-sm font-semibold  w-[120px]  py-4 px-2 border-r flex ">
            Status <ChevronsUpDown className="w-4 h-4" />
          </h3>
          <h3 className="text-sm font-semibold  w-[188px]  py-4 px-2  flex ">
            Date <ChevronsUpDown className="w-4 h-4" />
          </h3>
        </div>

        <div className="flex flex-col items-center justify-center text-center py-8">
          <RotateCcw className="w-8 h-8 text-gray-400 mb-4" />
          <p className="text-base font-medium text-gray-800">No Upcoming Bookings</p>
          <p className="text-sm text-gray-500 mt-1 max-w-md">You currently have no upcoming stays. Your future bookings will appear here once confirmed.</p>
        </div>
      </div>
    </div>
  );
};
