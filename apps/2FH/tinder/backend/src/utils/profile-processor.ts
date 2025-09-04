import { Profile } from "../models/profile-model";
import { GraphQLProfile } from "./profile-types";
import { mapProfileToGraphQL } from "./profile-mapper";
import { buildGenderFilter, buildInterestedInFilter } from "./profile-filters";

// Extract profile filtering logic to reduce complexity
export const getFilteredProfiles = async (userProfile: any, currentUserId: string): Promise<any[]> => {
  const userInterestedIn = userProfile.interestedIn?.toLowerCase();
  const userGender = userProfile.gender?.toLowerCase();
  
  const genderFilter = buildGenderFilter(userInterestedIn);
  const interestedInFilter = buildInterestedInFilter(userGender);
  
  return await Profile.find({
    ...genderFilter,
    ...interestedInFilter,
    userId: { $ne: currentUserId },
  });
};

// Helper function to process profiles
export const processProfiles = async (userProfile: any, currentUserId: string): Promise<GraphQLProfile[]> => {
  const filteredProfiles = await getFilteredProfiles(userProfile, currentUserId);
  console.log(`Found ${filteredProfiles.length} filtered profiles for user ${currentUserId}`);
  
  const mappedProfiles = await Promise.all(filteredProfiles.map(mapProfileToGraphQL));
  console.log(`Mapped ${mappedProfiles.length} profiles`);
  
  return mappedProfiles;
};