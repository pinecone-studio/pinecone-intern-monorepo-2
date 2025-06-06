'use client';

import { Button } from '@/components/ui/button';
// import { useGetAllOrderQuery} from '@/generated';

export const OrderInfo = () => {


  // const { data, loading, error } = useGetAllOrderQuery();


  return (
    <div className="self-stretch w-full mt-5 h-56 p-8 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-zinc-200 inline-flex flex-col justify-start items-end gap-4">
      <div className="self-stretch flex flex-col justify-center items-end gap-6">
        <div className="self-stretch flex flex-col justify-start items-start gap-6">
          <div className="self-stretch inline-flex justify-between items-center">
            <div className="flex justify-start items-center gap-4">
              <div className="flex justify-start items-center gap-2">
                <div className="justify-start text-Background-BackgroundInverseHover text-2xl font-bold font-['GIP'] leading-tight">#33999</div>
                <div className="justify-start text-Text-TextSecondary text-2xl font-normal font-['GIP'] leading-tight">1b</div>
              </div>
            </div>
            <div className="w-40 self-stretch flex justify-end items-center gap-1">
              <div className="w-4 h-4 relative overflow-hidden">
                <div className="w-3.5 h-3.5 left-[1.33px] top-[1.33px] absolute outline outline-1 outline-offset-[-0.50px] outline-border-border-foreground"></div>
              </div>
              <div className="text-right justify-start text-text-text-foreground text-base font-medium font-['GIP'] leading-7">12:45</div>
            </div>
          </div>
          <div className="self-stretch h-px border border-border-border-border"></div>
          <div className="self-stretch inline-flex justify-between items-end">
            <div className="font-normal">Нийлбэр дүн:</div>
            <div className="font-semibold">25’900₮</div>
          </div>
        </div>
        <div className="self-stretch flex flex-col justify-center items-center gap-4">
          <div className="self-stretch flex flex-col justify-start items-end gap-2">
            <div className="flex flex-wrap items-center gap-2 md:flex-row">
              <Button className="">Дэлгэрэнгүй харах</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
