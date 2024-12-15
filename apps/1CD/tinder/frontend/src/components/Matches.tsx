'use clinet';

import Image from 'next/image';

export const Matches = () => {
  return (
    <div className="flex flex-col gap-2" data-cy="Chat-Matches-Page">
      <div className="text-xl text-black">Matches</div>
      <div className='flex items-start'>
        <div className="p-6 flex flex-col gap-2 justify-center items-center text-center">
          <div className="rounded-full w-10 h-10 overflow-hidden">
            <Image src="/profile.jpeg" alt="Profile pic" width={40} height={40} className="object-cover w-full h-full aspect-square" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm text-black">Leslie Alexander ,24</p>
            <p className="text-sm text-muted-foreground">Software Engineer</p>
          </div>
        </div>
        <div className="p-6 flex flex-col gap-2 justify-center items-center text-center">
          <div className="rounded-full w-10 h-10 overflow-hidden">
            <Image src="/profile.jpeg" alt="Profile pic" width={40} height={40} className="object-cover w-full h-full aspect-square" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm text-black">Leslie Alexander ,24</p>
            <p className="text-sm text-muted-foreground">Software Engineer</p>
          </div>
        </div>
      </div>
    </div>
  );
};
