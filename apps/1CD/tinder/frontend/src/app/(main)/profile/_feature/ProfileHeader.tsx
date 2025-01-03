import { LuMenu } from 'react-icons/lu';

const ProfileHeader = ({ onMenuToggle }: { onMenuToggle: () => void }) => {
  return (
    <div className="mb-8">
      {/* User Info and LuMenu icon */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-semibold text-zinc-950">Hi, Shagai</h3>
          <p className="text-base font-normal text-zinc-500">n.shagai@pinecone.mn</p>
        </div>

        {/* LuMenu Icon - Only visible on small screens */}
        <div className="lg:hidden flex items-center justify-end">
          <LuMenu
            className="text-zinc-950 text-2xl cursor-pointer"
            onClick={onMenuToggle}
          />
        </div>
      </div>
      <hr className="bg-zinc-200 mt-4" />
    </div>
  );
};

export default ProfileHeader;
