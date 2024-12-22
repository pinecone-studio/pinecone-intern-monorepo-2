'use client';
import Image from 'next/image';
import { useMatchedUsersContext } from './providers/MatchProvider';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';


export const Matches = () => {
 const {matchedData} = useMatchedUsersContext()
 const params = useParams<{ id: string }>();
 const { id } = params;
 const router = useRouter()
 const  handlechat =(_id:string)=> {
  router.push(`/chat/${_id}`)
 }
  return (
    <div className="flex flex-col gap-2" data-cy="Matches-Page">
      <div className="text-xl text-black">Matches</div>
      <div className='flex items-start'>
        {matchedData?.map((matchedUser)=> 
        matchedUser.hasChatted == false &&
         <button className="p-6 flex flex-col gap-2 justify-center items-center text-center" onClick={()=> handlechat(matchedUser._id)} key={matchedUser._id}  data-cy={`Matched-Users-${matchedUser._id}`}>
         <div className="rounded-full w-10 h-10 overflow-hidden">
           <Image src={matchedUser.photos[0]} alt="Profile pic" width={40} height={40} className="object-cover w-full h-full aspect-square" />
         </div>
         <div className="flex flex-col gap-1">
           <p className={`text-sm ${id==matchedUser._id? "text-[#E11D48]": "text-black"}`}>{matchedUser.name} ,{matchedUser.age}</p>
           <p className="text-sm text-muted-foreground">{matchedUser.profession}</p>
         </div>
       </button>
        )}
      </div>
    </div>
  );
};
