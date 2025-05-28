'use client';
import Caro from './components/Caro';

const Page = () => {
  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-[#FFFFFF]">
      <div className="w-full max-w-[430px] min-h-screen mx-auto flex flex-col gap-6 relative px-4">
        <div className="h-[56px] flex items-center justify-center">Header here</div>
        <div className="flex flex-col justify-center items-center gap-8">
          <h1 className="text-[20px] text-[#441500] font-semibold leading-8">Хоолны цэс</h1>
          <div className="w-full gap-1 flex items-center">
            <Caro />
          </div>
        </div>
        <div className="sticky bottom-4 pt-6 bg-white/80 backdrop-blur-[2px]">
          <button className="w-full h-12 px-4 bg-amber-950 rounded-md shadow-md text-white text-sm font-medium font-['GIP'] leading-tight">Захиалах</button>
        </div>
      </div>
    </div>
  );
};

export default Page;
