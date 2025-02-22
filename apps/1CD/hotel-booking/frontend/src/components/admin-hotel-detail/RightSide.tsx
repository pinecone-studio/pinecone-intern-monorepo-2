import { Button } from '@/components/ui/button';
import { Hotel } from '@/generated';
import Image from 'next/image';

const RightSide = ({
  hotel,
  setIsOpenLocationDialog,
  setIsOpenImageDialog,
}: {
  hotel: Hotel | undefined;
  setIsOpenLocationDialog: (_value: boolean) => void;
  setIsOpenImageDialog: (_value: boolean) => void;
}) => {
  return (
    <div className="w-[30%] flex flex-col gap-4">
      <div className="flex flex-col gap-4 px-6 py-4 bg-white rounded-md">
        <div className="flex justify-between">
          <div className="font-semibold text-black">Location</div>
          <Button
            data-cy="Update-Location-Dialog-Open-Button"
            data-testid="Location-Dialog-Open-Button"
            onClick={() => setIsOpenLocationDialog(true)}
            className="text-blue-400 bg-white border hover:bg-slate-100 active:bg-slate-200"
          >
            Edit
          </Button>
        </div>
        <div>{hotel?.location}</div>
        <div>{hotel?.description}</div>
      </div>
      <div className="px-6 py-4 bg-white rounded-md">
        <div className="flex justify-between mb-4">
          <div className="font-semibold text-black">Images</div>
          <Button
            data-cy="Image-Update-Dialog-Open-Button"
            data-testid="Location-Dialog-Close-Button"
            onClick={() => setIsOpenImageDialog(true)}
            className="text-blue-400 bg-white border hover:bg-slate-100 active:bg-slate-200"
          >
            Edit
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {hotel?.images?.map((image, index) => (
            <Image key={index} width={1000} height={1000} className={`${index == 0 && 'col-span-2'} h-[200px] rounded-sm`} src={image || '/'} alt="image" />
          ))}
        </div>
      </div>
    </div>
  );
};
export default RightSide;
