'use client';

import { useParams } from 'next/navigation';
import { useGetStoryByUserIdQuery } from '@/generated';
import Image from 'next/image';

const UserProfile = () => {
  const params = useParams();
  const userId = params.userId as string;

  const { data, loading, error } = useGetStoryByUserIdQuery({
    skip: !userId,
    variables: { author: userId },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data?.getStoryByUserId?.length) return <p>No stories found</p>;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-xl font-medium">Stories</h3>
        {data.getStoryByUserId.map((story) => (
          <div key={story._id} className="rounded-xl overflow-hidden shadow">
            <Image src={story.image} alt="story image" width={400} height={400} className="w-full h-auto object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProfile;
