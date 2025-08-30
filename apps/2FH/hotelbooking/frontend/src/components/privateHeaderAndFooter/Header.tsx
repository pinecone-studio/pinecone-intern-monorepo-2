import Image from 'next/image';
export const Header = () => {
  return (
    <div data-testid='Header-Container'>
      <div className="flex justify-between w-[1280px] pt-5 pb-5">
        <div className="flex gap-[5px]">
          <div className="p-3 bg-[#2563EB] rounded-full "></div>
          <div className="w-full h-full">Pedia</div>
        </div>
        <div className="flex  gap-10">
          <div>My booking</div>
          <div>Shagai</div>
        </div>
      </div>
    </div>
  );
};
