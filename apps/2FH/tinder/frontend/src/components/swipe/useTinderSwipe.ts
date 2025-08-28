import { useState, useCallback, useEffect } from 'react';
import { Profile, mockProfiles } from './MockData';
import { toast } from 'react-toastify';
import { useGetAllProfilesQuery, useGetProfileQuery } from '../../generated';

interface ProfileData {
  gender: string;
  userId: string;
}

const useProfileData = (currentUserId: string) => {
  const { data: profilesData, loading, error, refetch } = useGetAllProfilesQuery();
  const { data: userProfileData, loading: userLoading, error: userError } = useGetProfileQuery({
    variables: { userId: currentUserId },
  });

  return { profilesData, userProfileData, loading, userLoading, error, userError, refetch };
};

const filterProfilesByGender = (userGender: string, profiles: ProfileData[], currentUserId: string) => {
  if (userGender === 'male') {
    return profiles.filter(profile => 
      profile.gender.toLowerCase() === 'female' && profile.userId !== currentUserId
    );
  } else if (userGender === 'female') {
    return profiles.filter(profile => 
      profile.gender.toLowerCase() === 'male' && profile.userId !== currentUserId
    );
  } else if (userGender === 'both') {
    return profiles.filter(profile => 
      (profile.gender.toLowerCase() === 'male' || profile.gender.toLowerCase() === 'female') && 
      profile.userId !== currentUserId
    );
  }
  return [];
};

const useProfileFiltering = (currentUserId: string) => {
  const { profilesData, userProfileData, loading, error } = useProfileData(currentUserId);
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    if (!userProfileData?.getProfile?.gender || !profilesData?.getAllProfiles) {
      return;
    }

    const userGender = userProfileData.getProfile.gender.toLowerCase();
    const filteredProfiles = filterProfilesByGender(userGender, profilesData.getAllProfiles as ProfileData[], currentUserId);

    setProfiles(filteredProfiles as Profile[]);

    if (!loading && !error && filteredProfiles.length === 0) {
      const mockFilteredProfiles = filterProfilesByGender(userGender, mockProfiles as ProfileData[], currentUserId);
      setProfiles(mockFilteredProfiles as Profile[]);
    }
  }, [profilesData, userProfileData, loading, error, currentUserId]);

  return { profiles, setProfiles };
};

export const useTinderSwipe = (currentUserId: string) => {
  const { profilesData, userProfileData, loading, userLoading, error, userError, refetch } = useProfileData(currentUserId);
  const { profiles, setProfiles } = useProfileFiltering(currentUserId);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matchedProfile, setMatchedProfile] = useState<Profile | null>(null);
  const [animatingCards, setAnimatingCards] = useState<Set<string>>(new Set());

  // Reset currentIndex when profiles change
  useEffect(() => {
    if (profiles.length > 0 && currentIndex >= profiles.length) {
      setCurrentIndex(0);
    }
  }, [profiles, currentIndex]);

  const mockSwipe = useCallback(async (direction: 'left' | 'right') => {
    toast.success(`Swipe ${direction === 'right' ? 'LIKE' : 'DISLIKE'} амжилттай!`);
    if (direction === 'right' && Math.random() > 0.7) {
      const currentProfile = profiles[currentIndex];
      if (currentProfile) {
        setMatchedProfile(currentProfile);
      }
    }
  }, [profiles, currentIndex]);

  const realSwipe = useCallback(async (direction: 'left' | 'right') => {
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      // Use mockSwipe for now since we don't have real API
      await mockSwipe(direction);
    } catch (error) {
      console.error('Swipe error:', error);
      toast.error('Swipe хийхэд алдаа гарлаа');
    }
  }, [mockSwipe]);

  const handleSwipe = useCallback(
    async (direction: 'left' | 'right') => {
      const currentProfile = profiles[currentIndex];
      if (!currentProfile) return;

      setAnimatingCards((prev) => new Set([...prev, currentProfile.id]));

      try {
        await realSwipe(direction);
      } catch (error) {
        console.error('Swipe error:', error);
      }

      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setTimeout(() => {
          setAnimatingCards((prev) => {
            const newSet = new Set(prev);
            newSet.delete(currentProfile.id);
            return newSet;
          });
        }, 50);
      }, 50);
    },
    [currentIndex, profiles, realSwipe]
  );

  const handleDislike = useCallback(() => {
    const currentProfile = profiles[currentIndex];
    setAnimatingCards((prev) => new Set([...prev, currentProfile.id]));
    setTimeout(() => handleSwipe('left'), 20);
  }, [handleSwipe, currentIndex, profiles]);

  const handleLike = useCallback(() => {
    const currentProfile = profiles[currentIndex];
    setAnimatingCards((prev) => new Set([...prev, currentProfile.id]));
    setTimeout(() => handleSwipe('right'), 20);
  }, [handleSwipe, currentIndex, profiles]);

  const handleSuperLike = useCallback(() => {
    const currentProfile = profiles[currentIndex];
    setAnimatingCards((prev) => new Set([...prev, currentProfile.id]));
    setTimeout(() => handleSwipe('right'), 20);
  }, [handleSwipe, currentIndex, profiles]);

  const handleKeepSwiping = useCallback(() => setMatchedProfile(null), []);

  const handleMessage = useCallback(() => {
    setMatchedProfile(null);
    alert('Opening messages...');
  }, []);

  const visibleProfiles = profiles.slice(currentIndex, currentIndex + 3);

  return {
    profiles,
    currentIndex,
    matchedProfile,
    animatingCards,
    loading,
    userLoading,
    error,
    userError,
    visibleProfiles,
    refetch,
    handleSwipe,
    handleDislike,
    handleLike,
    handleSuperLike,
    handleKeepSwiping,
    handleMessage,
    setCurrentIndex,
  };
}; 