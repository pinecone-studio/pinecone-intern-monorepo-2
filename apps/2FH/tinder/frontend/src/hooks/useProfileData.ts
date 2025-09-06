import { useGetAllProfilesQuery, useGetProfileQuery } from '@/generated';

export const useProfileData = (currentUserId: string) => {
  const { data: profilesData, loading, error, refetch } = useGetAllProfilesQuery();
  const { data: userProfileData, loading: userLoading, error: userError } = useGetProfileQuery({
    variables: { userId: currentUserId },
  });

  return { profilesData, userProfileData, loading, userLoading, error, userError, refetch };
};
