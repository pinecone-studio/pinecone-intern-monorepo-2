'use client';

import { FollowBtn } from '@/app/(main)/_components/follow/FollowButton';
import { useAuth } from '@/components/providers';
import { useGetFollowingsQuery, useGetSuggestUserQuery } from '@/generated';
import Image from 'next/image';
import Link from 'next/link';

const SuggestUserPage = () => {
  const { user } = useAuth();
  const { data } = useGetSuggestUserQuery();
  const { data: data1 } = useGetFollowingsQuery({
    variables: {
      followerId: user?._id || '',
    },
  });
  const followingsOfMyFollowings = data?.getSuggestUser;
  const myFollowingInfo = data1?.seeFollowings;
  const SuggestFollowingsWithUser = followingsOfMyFollowings?.filter((item) => !myFollowingInfo?.map((i) => String(i.followingId._id)).includes(String((item?.followingId as any)._id)));

  const SuggestFollowerDuplicate = SuggestFollowingsWithUser?.filter((item) => String((item?.followingId as any)._id) !== user?._id);
  const SuggestUser = SuggestFollowerDuplicate?.filter((obj, index, self) => index === self.findIndex((t) => t?.followingId._id === obj?.followingId._id));
  return (
    <div className="flex flex-col items-center w-full gap-5 p-20">
      <div className="flex flex-col items-center w-[326px] gap-5 ">
        <h1 className="font-bold">Suggested</h1>
        {SuggestUser?.map((user) => {
          return (
            <div key={user?.followerId._id} data-testid="suggest-user-comp" className="flex items-center justify-between w-full">
              <Link href={`/home/viewprofile/${user?.followingId._id}`} className="flex items-center gap-2">
                <div className="relative flex w-8 h-8 rounded-full">
                  <Image fill={true} src={user?.followingId.profileImg || '/images/profileImg.webp'} alt="Photo1" className="w-auto h-auto rounded-full" sizes="w-auto h-auto" priority />
                </div>
                <div className="">
                  <h1 className="text-sm font-bold ">{user?.followingId.userName}</h1>
                  <p className="text-[12px] text-gray-500 ">followed by {user?.followerId.userName}</p>
                </div>
              </Link>
              <div>
                <FollowBtn userId={user?.followingId?._id || ''} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default SuggestUserPage;
