import { QueryResolvers, Gender } from "src/generated";
import { Profile } from "../../models/profile-model";
import { Context } from "../../types";

// Helper function to map gender string to enum
const mapGender = (genderStr: string): Gender => {
  switch (genderStr.toLowerCase()) {
    case "male":
      return Gender.Male;
    case "female":
      return Gender.Female;
    case "both":
      return Gender.Both;
    default:
      return Gender.Male;
  }
};

// Helper function to map array of IDs
const mapIds = (ids: any[] | undefined): string[] => {
  return ids ? ids.map((id: any) => id.toString()) : [];
};

const mapProfileToGraphQL = (profile: any): any => {
  const profileObj = profile.toObject();
  
  return {
    id: profileObj._id.toString(),
    userId: profileObj.userId.toString(),
    name: profileObj.name,
    gender: mapGender(profileObj.gender),
    bio: profileObj.bio,
    interests: profileObj.interests,
    profession: profileObj.profession,
    work: profileObj.work,
    images: profileObj.images,
    dateOfBirth: profileObj.dateOfBirth,
    likes: mapIds(profileObj.likes),
    matches: mapIds(profileObj.matches),
    createdAt: profileObj.createdAt,
    updatedAt: profileObj.updatedAt,
  };
};

// Extract profile filtering logic to reduce complexity
const getFilteredProfiles = async (userGender: string, currentUserId: string): Promise<any[]> => {
  if (userGender === "male") {
    return await Profile.find({
      gender: "female",
      userId: { $ne: currentUserId },
    });
  } else if (userGender === "female") {
    return await Profile.find({
      gender: "male",
      userId: { $ne: currentUserId },
    });
  } else if (userGender === "both") {
    return await Profile.find({
      gender: { $in: ["male", "female"] },
      userId: { $ne: currentUserId },
    });
  }
  
  // Default fallback
  return await Profile.find({
    gender: "female",
    userId: { $ne: currentUserId },
  });
};

// Helper function to validate user authentication
const validateUser = (context: Context) => {
  const { currentUser } = context;
  if (!currentUser) {
    console.log("No currentUser in context - authentication required");
    throw new Error("User not authenticated");
  }
  console.log("User authenticated:", currentUser.userId);
  return currentUser;
};

// Helper function to fetch user profile
const fetchUserProfile = async (userId: string) => {
  const userProfile = await Profile.findOne({ userId });
  if (!userProfile) {
    throw new Error("User profile not found");
  }
  return userProfile;
};

// Helper function to process profiles
const processProfiles = async (userGender: string, currentUserId: string) => {
  const filteredProfiles = await getFilteredProfiles(userGender, currentUserId);
  console.log(`Found ${filteredProfiles.length} filtered profiles for user ${currentUserId}`);
  
  const mappedProfiles = filteredProfiles.map(mapProfileToGraphQL);
  console.log(`Mapped ${mappedProfiles.length} profiles`);
  
  return mappedProfiles;
};

export const getAllProfiles: QueryResolvers["getAllProfiles"] = async (
  _parent,
  _args,
  context: Context,
  _info
): Promise<any[]> => {
  try {
    console.log("getAllProfiles called with context:", context);

    const currentUser = validateUser(context);
    const userProfile = await fetchUserProfile(currentUser.userId);
    const userGender = userProfile.gender.toLowerCase();
    
    return await processProfiles(userGender, currentUser.userId);
  } catch (error) {
    console.error("Error in getAllProfiles resolver:", error);

    // Re-throw the original error if it's already a GraphQL error
    if (error instanceof Error) {
      throw error;
    }

    // Otherwise, throw a generic error
    throw new Error("Failed to fetch profiles");
  }
};
