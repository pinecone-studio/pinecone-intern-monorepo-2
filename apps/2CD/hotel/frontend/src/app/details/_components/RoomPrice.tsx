import { IconRight } from 'react-day-picker';

type DescriptionProps = {
  price?: string | undefined;
};
export const RoomPrice = ({ price }: DescriptionProps) => {
  const pricePerNight = Number(price) / 2;
  return (
    <div className="w-full h-fit inline-flex flex-col gap-3">
      <div>
        <p className="text-[#71717A] text-[12px]">Total</p>
        <p>{price}&#x20AE;</p>
        <p className="text-[#71717A] text-[12px]">{pricePerNight}&#x20AE; price per night</p>
      </div>
      <div className="flex gap-4 w-full justify-between">
        <div className="text-[#2563EB] text-[15px] flex items-center">
          Price Detail <IconRight />
        </div>
        <button className="w-fit h-fit flex justify-center items-center px-3 py-2 rounded-sm bg-[#2563EB] text-white">Reserve</button>
      </div>
    </div>
  );
};
