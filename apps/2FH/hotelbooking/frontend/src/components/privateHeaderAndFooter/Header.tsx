export const Header = () => {
  return (
    <div data-testid="Header-Container">
      <div className="flex justify-between w-[1280px] pt-5 pb-5">
        <div className="flex gap-[5px] items-center">
          <div className="p-3 bg-[#2563EB] rounded-full w-[20px] h-[20px]"></div>
          <div className="w-full h-full font-medium text-[20px]">Pedia</div>
        </div>
        <div className="flex  gap-10">
          <div>My booking</div>
          <div>Shagai</div>
        </div>
      </div>
    </div>
  );
};
