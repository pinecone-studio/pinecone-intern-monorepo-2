'use client';

import { Plus } from "lucide-react";
import { ClientDatePicker } from "./DatePicker";
import { NoFreeReq } from "./NoFreeReq";

const Page = () => {
  return (
    <div className="mx-auto max-w-[608px] h-screen mt-[100px]">
      <div>
        <div className="text-[#000000] text-xl font-medium">Чөлөө авсан:</div>
        <div className="flex justify-between mt-4">
          <div><ClientDatePicker /></div>
          <div className="w-[140px] h-[40px] rounded-md bg-black text-[#FAFAFA] text-center flex gap-1.5 justify-center items-center text-sm"><Plus size={17} strokeWidth={1.75} />Чөлөө хүсэх</div>
        </div>
      </div>
      <NoFreeReq/>
    </div>
  )
};

export default Page;
