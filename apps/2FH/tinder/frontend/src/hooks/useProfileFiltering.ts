import { useState, useEffect } from 'react';
import { Profile } from '../generated';
import { useProfileData } from './useProfileData';

interface ProfileData {
  id: string;
  userId: string;
  gender: string;
  name: string;
}

const filterProfilesByInterestedIn = (userInterestedIn: string, profiles: ProfileData[], currentUserId: string) => {
  // Filter out current user's profile first
  const otherProfiles = profiles.filter(profile => profile.userId !== currentUserId);

  switch (userInterestedIn?.toLowerCase()) {
    case 'male':
      return otherProfiles.filter(profile =>
        profile.gender.toLowerCase() === 'male'
      );
    case 'female':
      return otherProfiles.filter(profile =>
        profile.gender.toLowerCase() === 'female'
      );
    case 'both':
      return otherProfiles.filter(profile =>
        profile.gender.toLowerCase() === 'male' ||
        profile.gender.toLowerCase() === 'female'
      );
    default:
      // If interestedIn is not set or invalid, show all profiles
      return otherProfiles;
  }
};

const processProfiles = (userInterestedIn: string, profilesData: ProfileData[], currentUserId: string) => {
  const filteredProfiles = filterProfilesByInterestedIn(userInterestedIn, profilesData, currentUserId);
  return filteredProfiles as Profile[];
};

const getFilteredProfilesFromBackend = (userProfileData: any, profilesData: any, currentUserId: string) => {
  if (!userProfileData?.getProfile?.interestedIn || !profilesData?.getAllProfiles) {
    return [];
  }

  const userInterestedIn = userProfileData.getProfile.interestedIn.toLowerCase();
  const filteredProfiles = processProfiles(userInterestedIn, profilesData.getAllProfiles as ProfileData[], currentUserId);

  return filteredProfiles;
};

const getFallbackProfiles = (currentUserId: string) => {
  console.log('No profiles available from backend');
  return [];
};

export const useProfileFiltering = (currentUserId: string) => {
  const { profilesData, userProfileData, loading, error } = useProfileData(currentUserId);
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    console.log('Profile filtering effect triggered:', {
      userProfileData: userProfileData?.getProfile,
      profilesData: profilesData?.getAllProfiles,
      loading,
      error,
      currentUserId
    });

    let finalProfiles = getFilteredProfilesFromBackend(userProfileData, profilesData, currentUserId);

    if (finalProfiles.length === 0) {
      finalProfiles = getFallbackProfiles(currentUserId);
    }

    console.log(`Setting ${finalProfiles.length} profiles`);
    setProfiles(finalProfiles);
  }, [profilesData, userProfileData, loading, error, currentUserId]);

  return { profiles, setProfiles };
};
