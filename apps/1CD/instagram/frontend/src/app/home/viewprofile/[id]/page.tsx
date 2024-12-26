'use client';

import { useAuth } from '@/components/providers';
import { useUser } from '@/components/providers/UserProvider';
import HeadingSection from '@/components/visit-profile/HeadingSection';
import PrivateProfile from '@/components/visit-profile/PrivateProfile';
import { useGetFollowStatusQuery, useGetOneUserQuery } from '@/generated';
import { Grid3x3 } from 'lucide-react';

import { useParams } from 'next/navigation';
import React, { useState } from 'react';

const ViewProfile = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [buttonState, setButtonState] = useState<'Follow' | 'Requested' | 'Following'>('Follow');

  const { sendFollowReq, followLoading } = useUser();
  const { data } = useGetOneUserQuery({
    variables: { id: id as string },
    skip: !id,
  });

  const profileUser = data?.getOneUser;

  const { data: followData } = useGetFollowStatusQuery({
    variables: {
      followerId: user?._id as string,
      followingId: profileUser?._id as string,
    },
  });

  const handleFollowClick = async () => {
    try {
      const { data } = await sendFollowReq({
        variables: {
          followerId: user?._id as string,
          followingId: profileUser?._id as string,
        },
      });

      if (data?.sendFollowReq.status === 'PENDING') {
        setButtonState('Requested');
      } else if (data?.sendFollowReq.status === 'APPROVED') {
        setButtonState('Following');
      }
    } catch (err) {
      console.error('Error sending follow request:', err);
    }
  };

  return (
    <div className="mx-auto my-10" data-cy="visit-profile-page">
      <div className="w-[900px]">
        <HeadingSection profileUser={profileUser} followLoading={followLoading} buttonState={buttonState} handleFollowClick={handleFollowClick} followData={followData} />
        {profileUser?.accountVisibility === 'PUBLIC' ? (
          <div className="relative flex mb-10 border-t border-t-gray-200" data-cy="public-user">
            <div className=" border-t border-t-black hover:text-black absolute left-[50%]">
              <div className="flex items-center mt-3">
                <Grid3x3 />
                <p>POSTS</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center p-10 border-t border-t-gray-200">
            <PrivateProfile />
          </div>
        )}
        {/* <div className="mt-14">
          {error && (
            <p className="font-normal" data-cy="postsError">
              Something wrong
            </p>
          )}
        </div> */}
      </div>
    </div>
  );
};

export default ViewProfile;
