'use client';

import Accepted from "@/components/leave-calendar/PersonOnLeave";
import DateRangeButton from "@/components/supervisor/DateRangeButton";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";



const Page = () => {

  const router = useRouter()
  return (
    <>
      <div className="w-[684PX]  mx-auto mt-[36px]">
        <div className="font-bold my-4">Чөлөө авсан:</div>
        <div className="flex justify-between">
          <DateRangeButton />
          <Button
            className="w-[140px] text-xs gap-2"
            onClick={() => {
              router.push('/createNewRequest');
            }}
          >
            <Plus size={16} />
            Чөлөө хүсэх
          </Button>
        </div>
        <Accepted />
      </div>
    </>
  );
};

export default Page;
