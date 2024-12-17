import Image from 'next/image';
import { useMatchedUsersContext } from './providers/MatchProvider';

export const Chatsidebar = () => {
  const {matchedData} = useMatchedUsersContext()
  return (
    <div className="flex flex-col items-start border-r h-screen" data-cy="Chat-Sidebar-Page">
      {matchedData?.map((matchedUser)=>
         <button>
         <div className="py-6 pl-6 pr-[114px] flex justify-center items-center  gap-3 border-b border-t">
           <div className="rounded-full w-12 h-12 overflow-hidden">
             <Image src="/profile.jpeg" alt="Profile pic" width={48} height={48} className="object-cover w-full h-full aspect-square" />
           </div>
           <div className="flex flex-col gap-1">
             <p className="text-sm text-black">{matchedUser.name} ,{matchedUser.age}</p>
             <p className="text-sm text-muted-foreground">{matchedUser.profession}</p>
           </div>
         </div>
       </button>
      )}
     
    </div>
  );
};
