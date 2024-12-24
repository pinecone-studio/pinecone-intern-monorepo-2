import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import React from 'react';

const PrivateProfile = () => {
  return (
    <div className="flex flex-col items-center gap-6" data-cy="private-user">
      <div className="flex items-center justify-center gap-5">
        <div className="p-3 border border-black rounded-full">
          <Lock />
        </div>

        <div className="flex flex-col gap-2 tracking-wide">
          <p className="text-[#09090B] font-semibold text-base">This account is private</p>
          <p className="text-[#71717A] text-base">Follow to see their photos and videos</p>
        </div>
      </div>
      <Button className="bg-[#2563EB] rounded-lg">Follow</Button>
    </div>
  );
};

export default PrivateProfile;
