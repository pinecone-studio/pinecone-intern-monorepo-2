/*eslint-disable*/
'use client';

import { useAuth } from '@/components/providers';
import { useUser } from '@/components/providers/UserProvider';
import HeadingSection from '@/components/visit-profile/HeadingSection';
import PostsSection from '@/components/visit-profile/PostsSection';
import PrivateProfile from '@/components/visit-profile/PrivateProfile';
import { useGetFollowStatusQuery, useGetOneUserQuery, useGetUserPostsQuery, useUnfollowMutation } from '@/generated';
import { Grid3x3 } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';

export type FollowType = {
  _id: string;
};

const ViewProfile = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [buttonState, setButtonState] = useState<'Follow'>('Follow');

  const { sendFollowReq, followLoading } = useUser();
  const { data } = useGetOneUserQuery({
    variables: { id: id as string },
    skip: !id,
  });

  const profileUser = data?.getOneUser;

  const { data: followData, refetch } = useGetFollowStatusQuery({
    variables: {
      followerId: user?._id as string,
      followingId: profileUser?._id as string,
    },
  });

  const refresh = async () => {
    await refetch();
  };

  const [unfollowMutation] = useUnfollowMutation({
    onCompleted: () => {
      setButtonState('Follow');
      refresh();
    },
  });

  const unfollowUser = async ({ _id }: FollowType) => {
    if (!followData?.getFollowStatus?._id) {
      console.error('Error: Missing _id for unfollow.');
      return;
    }

    await unfollowMutation({
      variables: {
        id: followData.getFollowStatus._id,
        followerId: user?._id as string,
      },
    });
  };

  const handleFollowClick = async () => {
    try {
      const { data } = await sendFollowReq({
        variables: {
          followerId: user?._id as string,
          followingId: profileUser?._id as string,
        },
      });
      if (data?.sendFollowReq.status === undefined) {
        setButtonState('Follow');
      }
      await refresh();
    } catch (err) {
      throw new Error();
    }
  };

  const buttonText = followData?.getFollowStatus?.status === 'APPROVED' ? 'Following' : followData?.getFollowStatus?.status === 'PENDING' ? 'Requested' : buttonState;

  const handleButtonClick = async () => {
    if ((buttonText === 'Following' || buttonText === 'Requested') && followData?.getFollowStatus?._id) {
      await unfollowUser({ _id: followData.getFollowStatus._id });
    } else if (buttonText === 'Follow') {
      await handleFollowClick();
    }
  };

  const { data: userPostData } = useGetUserPostsQuery({
    variables: {
      user: profileUser?._id as string,
    },
  });

  return (
    <div className="mx-auto my-10" data-cy="visit-profile-page">
      <div className="w-[900px]">
        <HeadingSection profileUser={profileUser} followLoading={followLoading} buttonText={buttonText} handleButtonClick={handleButtonClick} />
        {profileUser?.accountVisibility === 'PUBLIC' ? (
          <div className="relative flex mb-10 border-t border-t-gray-200" data-cy="public-user">
            <div className=" border-t border-t-black hover:text-black absolute left-[50%]">
              <div className="flex items-center mt-3 mb-8">
                <Grid3x3 />
                <p>POSTS</p>
              </div>

              {/* <div>aaaaaaa</div> */}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center p-10 border-t border-t-gray-200">
            <PrivateProfile followLoading={followLoading} buttonText={buttonText} handleButtonClick={handleButtonClick} />
          </div>
        )}
        {/* <div className="mt-14">
          {error && (
            <p className="font-normal" data-cy="postsError">
              Something wrong
            </p>
          )}
        </div> */}
        {(profileUser?.accountVisibility === 'PUBLIC' || buttonText === 'Following') && (
          <div className="mt-20">
            <PostsSection userPostData={userPostData} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewProfile;
