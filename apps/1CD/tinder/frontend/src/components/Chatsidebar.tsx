import Image from 'next/image';

export const Chatsidebar = () => {
  return (
    <div className="flex flex-col items-start border-r h-screen" data-cy="Chat-Sidebar-Page">
      <button>
        <div className="py-6 pl-6 pr-[114px] flex justify-center items-center  gap-3 border-b border-t">
          <div className="rounded-full w-12 h-12 overflow-hidden">
            <Image src="/profile.jpeg" alt="Profile pic" width={48} height={48} className="object-cover w-full h-full aspect-square" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm text-black">Leslie Alexander ,24</p>
            <p className="text-sm text-muted-foreground">Software Engineer</p>
          </div>
        </div>
      </button>
      <button>
        <div className="py-6 pl-6 pr-[114px] flex items-center gap-3 border-b border-t">
          <div className="rounded-full w-12 h-12 overflow-hidden">
            <Image src="/profile.jpeg" alt="Profile pic" width={48} height={48} className="object-cover w-full h-full aspect-square" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm text-black">Leslie Alexander ,24</p>
            <p className="text-sm text-muted-foreground">Software Engineer</p>
          </div>
        </div>
      </button>
    </div>
  );
};
