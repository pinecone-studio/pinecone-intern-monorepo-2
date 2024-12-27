'use client';
import { Loader2Icon } from 'lucide-react';

const Loading = () => {
  return (
    <div className="min-h-screen">
      <div className="fixed flex flex-col justify-center items-center gap-6 translate-x-[-50%] left-[50%] top-[40%]">
        <div className="flex items-center gap-1">
          <div className="bg-[#2563EB] h-5 w-5 rounded-full" />
          <div className="text-[#09090B] text-foreground">Pedia</div>
        </div>
        <Loader2Icon className="animate-spin" />
        <div className="text-[#71717A] text-muted-foreground">Please wait...</div>
      </div>
    </div>
  );
};

export default Loading;
