import { useState, useEffect } from 'react';
import { Profile, mockProfiles } from './MockData';
import { useProfileData } from './useProfileData';

interface ProfileData {
  gender: string;
  userId: string;
}

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

const processProfiles = (userGender: string, profilesData: ProfileData[], currentUserId: string) => {
  const filteredProfiles = filterProfilesByGender(userGender, profilesData, currentUserId);
  return filteredProfiles as Profile[];
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

    // Always ensure we have some profiles to show
    let finalProfiles: Profile[] = [];

    if (userProfileData?.getProfile?.gender && profilesData?.getAllProfiles) {
      const userGender = userProfileData.getProfile.gender.toLowerCase();
      console.log(`User gender: ${userGender}, filtering profiles...`);
      
      const filteredProfiles = processProfiles(userGender, profilesData.getAllProfiles as ProfileData[], currentUserId);
      console.log(`Filtered profiles: ${filteredProfiles.length} profiles`);
      
      if (filteredProfiles.length > 0) {
        finalProfiles = filteredProfiles;
      }
    }

    // If no profiles from backend, use mock profiles
    if (finalProfiles.length === 0) {
      console.log('Using mock profiles as fallback');
      // Use 'both' gender to show all profiles for testing
      const mockFilteredProfiles = processProfiles('both', mockProfiles as ProfileData[], currentUserId);
      finalProfiles = mockFilteredProfiles;
    }

    console.log(`Setting ${finalProfiles.length} profiles`);
    setProfiles(finalProfiles);
  }, [profilesData, userProfileData, loading, error, currentUserId]);

  console.log(`useProfileFiltering: ${profiles.length} profiles available`);

  return { profiles, setProfiles };
};
