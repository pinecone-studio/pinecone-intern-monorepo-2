import { Button } from '@/components/ui/button';
import { Hotel } from '@/generated';
import Image from 'next/image';

const RightSide = ({ hotel }: { hotel: Hotel | undefined }) => {
  return (
    <div className="w-[30%] flex flex-col gap-4">
      <div className="flex flex-col gap-4 px-6 py-4 bg-white rounded-md">
        <div className="flex justify-between">
          <div className="font-semibold text-black">Location</div>
          <Button className="text-blue-400 bg-white border hover:bg-slate-100 active:bg-slate-200">Edit</Button>
        </div>
        <div>Ulaanbaatar</div>
        <div>{hotel?.description}</div>
      </div>
      <div className="px-6 py-4 bg-white rounded-md">
        <div className="flex justify-between mb-4">
          <div className="font-semibold text-black">Images</div>
          <Button className="text-blue-400 bg-white border hover:bg-slate-100 active:bg-slate-200">Edit</Button>
        </div>
        <div className="grid grid-cols-2">
          {hotel?.images?.map((image, index) => (
            <Image key={index} width={1000} height={1000} className={`${index == 0 && 'col-span-2'}`} src={image || '/'} alt="image" />
          ))}
        </div>
      </div>
    </div>
  );
};
export default RightSide;
