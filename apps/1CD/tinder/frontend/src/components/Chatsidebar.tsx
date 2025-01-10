import Image from 'next/image';
import { useMatchedUsersContext } from './providers/MatchProvider';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
export const Chatsidebar = () => {
  const router = useRouter();
  const { matchedData } = useMatchedUsersContext();
  const params = useParams<{ id: string }>();
  const { id } = params;

  const handlechat = (_id: string) => {
    router.push(`/chat/${_id}`);
  };

  return (
    <div className="flex flex-col items-start border-r" data-cy="Chat-Sidebar-Page">
      {matchedData?.map(
        (matchedUser) =>
          matchedUser.hasChatted == true && (
            <button
              className={`py-6 pl-6 pr-[114px] flex  items-center w-full gap-3 border-b border-t ${id == matchedUser._id ? 'bg-[#F4F4F5]' : 'bg-white'}`}
              onClick={() => handlechat(matchedUser._id)}
              key={matchedUser._id}
              data-cy={`Matched-User-${matchedUser._id}`}
            >
              <div className="w-12 h-12 overflow-hidden rounded-full">
                <Image src={matchedUser.photos[0]} alt="Profile pic" width={48} height={48} className="object-cover w-full h-full aspect-square" />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex gap-1">
                  <p className={`text-sm text-start ${id == matchedUser._id ? 'text-[#E11D48]' : 'text-black'}`}>{matchedUser.name},</p>
                  <p className={`text-sm text-start ${id == matchedUser._id ? 'text-[#E11D48]' : 'text-black'}`}>{matchedUser.age}</p>
                </div>
                <p className="text-sm text-start text-muted-foreground whitespace-nowrap">{matchedUser.profession}</p>
              </div>
            </button>
          )
      )}
    </div>
  );
};
