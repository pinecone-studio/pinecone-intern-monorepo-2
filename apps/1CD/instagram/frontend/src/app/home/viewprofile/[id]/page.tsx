/*eslint-disable*/
'use client';

import { useAuth } from '@/components/providers';
import { useUser } from '@/components/providers/UserProvider';
import HeadingSection from '@/app/(main)/_components/visitprofile/HeadingSection';
import PostsSection from '@/app/(main)/_components/visitprofile/PostsSection';
import PrivateProfile from '@/components/visit-profile/PrivateProfile';
import { useGetFollowersQuery, useGetFollowingsQuery, useGetFollowStatusQuery, useGetOneUserQuery, useGetUserPostsQuery, useUnfollowMutation } from '@/generated';
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

  const { data: userPostData } = useGetUserPostsQuery({
    variables: {
      user: id as string,
    },
  });

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
      followerRefetch();
    } catch (err) {
      throw new Error();
    }
  };

  const buttonText = followData?.getFollowStatus?.status === 'APPROVED' ? 'Following' : followData?.getFollowStatus?.status === 'PENDING' ? 'Requested' : buttonState;

  const handleButtonClick = async () => {
    if ((buttonText === 'Following' || buttonText === 'Requested') && followData?.getFollowStatus?._id) {
      await unfollowUser({ _id: followData.getFollowStatus._id });
      followerRefetch();
    } else if (buttonText === 'Follow') {
      await handleFollowClick();
      followerRefetch();
    }
  };

  const { data: followingData } = useGetFollowingsQuery({ variables: { followerId: profileUser?._id as string } });
  const { data: followerData, refetch: followerRefetch } = useGetFollowersQuery({ variables: { followingId: profileUser?._id as string } });

  if (!followingData || !followerData) return;
  const fetchedFollowerData = followerData.seeFollowers.map((oneFollower) => ({
    _id: oneFollower.followerId._id,
    userName: oneFollower.followerId.userName,
    profileImg: oneFollower.followerId.profileImg || '/images/profileImg.webp',
    fullName: oneFollower.followerId.fullName,
  }));
  const fetchedFollowingData = followingData.seeFollowings.map((oneFollowing) => ({
    _id: oneFollowing.followingId._id,
    userName: oneFollowing.followingId.userName,
    fullName: oneFollowing.followingId.fullName,
    profileImg: oneFollowing.followingId.profileImg || '/images/profileImg.webp',
  }));

  return (
    <div className="mx-auto my-10" data-cy="visit-profile-page">
      <div className="w-[900px]">
        <div className="">
          <HeadingSection
            profileUser={profileUser}
            followLoading={followLoading}
            buttonText={buttonText}
            handleButtonClick={handleButtonClick}
            fetchedFollowerData={fetchedFollowerData}
            fetchedFollowingData={fetchedFollowingData}
            userPostData={userPostData}
          />
        </div>

        {profileUser?.accountVisibility === 'PUBLIC' ? (
          <div className="relative flex mb-10 border-t border-t-gray-200" data-cy="public-user">
            <div className=" border-t border-t-black hover:text-black absolute left-[45%]">
              <div className="flex items-center mt-3 mb-8">
                <Grid3x3 />
                <p>POSTS</p>
              </div>
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
