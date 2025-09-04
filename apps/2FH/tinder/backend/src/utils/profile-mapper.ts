import { ProfileDocument, GraphQLProfile } from "./profile-types";

const mapBasicFields = (profileObj: ProfileDocument) => ({
  id: profileObj._id.toHexString(),
  userId: profileObj.userId.toHexString(),
  name: profileObj.name || '',
  gender: profileObj.gender,
  interestedIn: profileObj.interestedIn,
  bio: profileObj.bio || '',
});

const mapStringArrays = (profileObj: ProfileDocument) => ({
  interests: profileObj.interests || [],
  images: profileObj.images || [],
});

const mapObjectIdArrays = (profileObj: ProfileDocument) => ({
  likes: profileObj.likes.map(like => like.toHexString()) || [],
  matches: profileObj.matches.map(match => match.toHexString()) || [],
});

const mapArrayFields = (profileObj: ProfileDocument) => ({
  ...mapStringArrays(profileObj),
  ...mapObjectIdArrays(profileObj),
});

const mapStringFields = (profileObj: ProfileDocument) => ({
  profession: profileObj.profession || '',
  work: profileObj.work || '',
  dateOfBirth: profileObj.dateOfBirth || '',
});

const mapTimestampFields = (profileObj: ProfileDocument) => ({
  createdAt: profileObj.createdAt,
  updatedAt: profileObj.updatedAt,
});

export const mapProfileToGraphQL = async (profile: ProfileDocument): Promise<GraphQLProfile> => {
  return {
    ...mapBasicFields(profile),
    ...mapArrayFields(profile),
    ...mapStringFields(profile),
    ...mapTimestampFields(profile),
  };
};