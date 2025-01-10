import { User } from '@/generated';
import { LucideMenu } from 'lucide-react';

const ProfileHeader = ({ onMenuToggle ,data}: { onMenuToggle: () => void ,data:User | undefined}) => {
 console.log(data)
  return (
    <div className="mt-4 mb-8 sm:mt-4"> {/* Set margin-top to mt-4 for consistency across all screens */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-semibold text-zinc-950">Hi,{data?.name}</h3>
          <p className="text-base font-normal text-zinc-500">{data?.email}</p>
        </div>

        {/* LucideMenu Icon - Only visible on small screens */}
        <div className="block sm:hidden">
          <LucideMenu 
            size={20}
            className="text-2xl cursor-pointer text-zinc-950"
            onClick={onMenuToggle}
            data-cy="menu"
            aria-label="Open menu"
          />
        </div>
      </div>
      <hr className="mt-4 bg-zinc-200" />
    </div>
  );
};

export default ProfileHeader;
