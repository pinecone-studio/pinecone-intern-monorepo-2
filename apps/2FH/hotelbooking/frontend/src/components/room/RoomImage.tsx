import { ImageOff } from 'lucide-react';

export const RoomImage = () => {
  return (
    <div className="w-[400px] h-65 px-6 pb-6 pt-4 flex flex-col  gap-y-4 rounded-lg border border-solid  ">
      <div className="flex justify-between">
        <h3 className="font-semibold text-lg">Images</h3>
        <p className="text-[#2563EB] text-sm font-medium">Edit</p>
      </div>

      <div className="w-[352px] py-8 flex flex-col gap-y-4 items-center ">
        <ImageOff className="w-6 h-6" />

        <div className="flex flex-col gap-y-1 items-center">
          <h3 className="text-sm font-medium">No Photos Uploaded</h3>
          <p className="text-sm font-normal text-gray-500 text-center">Add photos of your rooms, amenities, or property to showcase your hotel.</p>
        </div>
      </div>
    </div>
  );
};
