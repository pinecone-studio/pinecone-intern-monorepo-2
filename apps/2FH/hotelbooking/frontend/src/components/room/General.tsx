import { RoomImage } from './RoomImage';

export const General = () => {
  return (
    <div className="flex gap-x-4">
      <div className="w-[784px] h-[249px] px-6 py-6 rounded-lg border border-solid">
        <div className="flex flex-col gap-y-6">
          <div className="flex justify-between">
            <h3 className="text-lg font-semibold">General Info</h3>
            <p className="text-sm font-medium text-[#2563EB]">Edit</p>
          </div>

          <div className="border-b border-gray-300"></div>

          <div className="flex gap-x-8">
            <div className="flex flex-col gap-y-1 w-[224px]">
              <p className="text-sm font-normal text-gray-500">Name</p>
              <p>-/-</p>
            </div>

            <div className="flex flex-col gap-y-1 w-[224px]">
              <p className="text-sm font-normal text-gray-500">Type</p>
              <p>-/-</p>
            </div>

            <div className="flex flex-col gap-y-1 w-[224px]">
              <p className="text-sm font-normal text-gray-500">Price Per Night</p>
              <p>-/-</p>
            </div>
          </div>

          <div className="flex flex-col gap-y-2">
            <p className="text-sm font-normal text-gray-500">Room information</p>
            <p>-/-</p>
          </div>
        </div>
      </div>
      <RoomImage />
    </div>
  );
};
