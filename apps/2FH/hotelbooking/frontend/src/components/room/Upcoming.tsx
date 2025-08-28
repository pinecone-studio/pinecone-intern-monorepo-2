import { RotateCcw, ChevronsUpDown } from 'lucide-react';

export const Upcoming = () => {
  return (
    <div data-cy="Upcoming" className="flex flex-col gap-y-6">
      <h3 data-cy="Upcoming-Bookings-Title" className="font-semibold text-lg text-gray-900">
        Upcoming Bookings
      </h3>
      <div data-cy="Upcoming-Bookings-Header" className="h-[40px] bg-gray-100 flex rounded-md">
        <h3 className="text-sm font-semibold w-[82px] py-2 px-2 border-r border-gray-200 flex items-center text-gray-700">ID</h3>
        <h3 className="text-sm font-semibold flex-1 py-2 px-2 border-r border-gray-200 flex items-center text-gray-700">Guest name</h3>
        <h3 className="text-sm font-semibold w-[120px] py-2 px-2 border-r border-gray-200 flex items-center gap-x-1 text-gray-700">
          Status
          <ChevronsUpDown className="w-4 h-4 text-gray-500" />
        </h3>
        <h3 className="text-sm font-semibold w-[188px] py-2 px-2 flex items-center gap-x-1 text-gray-700">
          Date
          <ChevronsUpDown className="w-4 h-4 text-gray-500" />
        </h3>
      </div>

      <div data-cy="Upcoming-Bookings-Empty" className="flex flex-col items-center justify-center text-center py-8 rounded-b-md">
        <RotateCcw className="w-8 h-8 text-gray-400 mb-4" />
        <p data-cy="Upcoming-Bookings-Empty-Title" className="text-base font-medium text-gray-800">
          No Upcoming Bookings
        </p>
        <p data-cy="Upcoming-Bookings-Empty-Description" className="text-sm text-gray-500 mt-1 max-w-md">
          You currently have no upcoming stays. Your future bookings will appear here once confirmed.
        </p>
      </div>
    </div>
  );
};
