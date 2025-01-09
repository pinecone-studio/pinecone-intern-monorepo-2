import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import React from 'react';

const PrivateProfile = ({ followLoading, buttonText, handleButtonClick }: { followLoading: boolean; buttonText: string; handleButtonClick: () => Promise<void> }) => {
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
      <Button className={`h-8 text-black bg-gray-200 ${followLoading && 'opacity-50 cursor-not-allowed'}`} onClick={handleButtonClick} disabled={followLoading}>
        {buttonText}
      </Button>
    </div>
  );
};

export default PrivateProfile;