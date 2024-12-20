import Image from 'next/image';
import { useMatchedUsersContext } from './providers/MatchProvider';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
export const Chatsidebar = () => {
  const router = useRouter()
  const {matchedData} = useMatchedUsersContext()
  const params = useParams<{ id: string }>();
  const { id } = params;

  const  handlechat =(_id:string)=> {
    router.push(`/chat/${_id}`)
   }
  return (
    <div className="flex flex-col items-start border-r" data-cy="Chat-Sidebar-Page">
      {matchedData?.map((matchedUser)=>
      matchedUser.hasChatted==true &&

         <button className="py-6 pl-6 pr-[114px] flex justify-center items-center  gap-3 border-b border-t" onClick={()=> handlechat(matchedUser._id)} key={matchedUser._id}>
           <div className="rounded-full w-12 h-12 overflow-hidden">
             <Image src="/profile.jpeg" alt="Profile pic" width={48} height={48} className="object-cover w-full h-full aspect-square" />
           </div>
           <div className="flex flex-col gap-1">
             <p className={`text-sm  ${id==matchedUser._id?"text-[#E11D48]":"text-black"}`}>{matchedUser.name} ,{matchedUser.age}</p>
             <p className="text-sm text-muted-foreground">{matchedUser.profession}</p>
           </div>
         </button>

      )}
     
    </div>
  );
};
