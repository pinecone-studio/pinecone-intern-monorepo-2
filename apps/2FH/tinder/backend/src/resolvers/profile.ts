import { Profile as ProfileModel, ProfileType } from "../models";
import { Types } from "mongoose";

interface ProfileParent {
  likes: Types.ObjectId[];
  matches: Types.ObjectId[];
}

interface ProfileDocument extends ProfileType {
  _id: Types.ObjectId;
}

// Field resolvers for Profile type
export const ProfileResolvers = {
  Profile: {
    likes: async (parent: ProfileParent) => {
      try {
        // parent.likes contains the ObjectIds from the database
        if (!parent.likes || parent.likes.length === 0) {
          return [];
        }
        
        // Fetch the actual profile documents for the likes
        const likedProfiles = await ProfileModel.find({
          userId: { $in: parent.likes }
        }).select('id userId name gender images profession');
        
        return likedProfiles.map((profile: ProfileDocument) => ({
          id: profile._id.toString(),
          userId: profile.userId.toString(),
          name: profile.name,
          gender: profile.gender,
          images: profile.images,
          profession: profile.profession,
        }));
      } catch (error) {
        console.error('Error resolving likes:', error);
        return [];
      }
    },
    
    matches: async (parent: ProfileParent) => {
      try {
        // parent.matches contains the ObjectIds from the database
        if (!parent.matches || parent.matches.length === 0) {
          return [];
        }
        
        // Fetch the actual profile documents for the matches
        const matchedProfiles = await ProfileModel.find({
          userId: { $in: parent.matches }
        }).select('id userId name gender images profession');
        
        return matchedProfiles.map((profile: ProfileDocument) => ({
          id: profile._id.toString(),
          userId: profile.userId.toString(),
          name: profile.name,
          gender: profile.gender,
          images: profile.images,
          profession: profile.profession,
        }));
      } catch (error) {
        console.error('Error resolving matches:', error);
        return [];
      }
    }
  }
};