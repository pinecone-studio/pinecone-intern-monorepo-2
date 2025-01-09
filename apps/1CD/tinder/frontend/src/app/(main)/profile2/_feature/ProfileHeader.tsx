import { LucideMenu } from 'lucide-react';

const ProfileHeader = ({ onMenuToggle }: { onMenuToggle: () => void }) => {
  return (
    <div className="mb-8 mt-4 sm:mt-4"> {/* Set margin-top to mt-4 for consistency across all screens */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-semibold text-zinc-950">Hi, Shagai</h3>
          <p className="text-base font-normal text-zinc-500">n.shagai@pinecone.mn</p>
        </div>

        {/* LucideMenu Icon - Only visible on small screens */}
        <div className="block sm:hidden">
          <LucideMenu 
            size={20}
            className="text-zinc-950 text-2xl cursor-pointer"
            onClick={onMenuToggle}
            data-cy="menu"
            aria-label="Open menu"
          />
        </div>
      </div>
      <hr className="bg-zinc-200 mt-4" />
    </div>
  );
};

export default ProfileHeader;
