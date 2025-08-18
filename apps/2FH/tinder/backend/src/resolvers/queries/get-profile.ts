import { Types } from 'mongoose';
import { Profile as ProfileModel } from 'src/models';
import { Gender } from 'src/generated';
import { GraphQLError } from 'graphql';

// Интерфейсийн тодорхойлолт
interface GetProfileArgs {
  userId: string;
}

interface Profile {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  gender: string; // Mongoose загварын gender (жишээ нь, 'male', 'female', 'both')
  bio: string;
  interests: string[];
  profession: string;
  work: string;
  images: string[];
  dateOfBirth?: string | null; // Mongoose загвартай нийцсэн
  createdAt: Date;
  updatedAt: Date;
}

// Алдааны мэдэгдэл тодорхойлох
const ERRORS = {
  INVALID_USER_ID: 'Invalid userId format',
  PROFILE_NOT_FOUND: 'Profile not found',
  INVALID_GENDER: 'Invalid gender value',
  FETCH_FAILED: 'Failed to fetch profile',
};

// Mongoose-ийн Gender-ийг GraphQL-ийн Gender руу хөрвүүлэх
const mapGenderToGraphQL = (gender: string): Gender => {
  const genderMap: Record<string, Gender> = {
    male: Gender.Male,
    female: Gender.Female,
    both: Gender.Both,
  };

  const normalizedGender = gender.toLowerCase();
  if (!(normalizedGender in genderMap)) {
    throw new Error(ERRORS.INVALID_GENDER);
  }
  return genderMap[normalizedGender];
};

// dateOfBirth-ийг зохицуулах
const parseDateOfBirth = (dateOfBirth: string | null | undefined): string | null => {
  if (!dateOfBirth) return null;
  const parsedDate = new Date(dateOfBirth);
  if (isNaN(parsedDate.getTime())) {
    console.warn('dateOfBirth is invalid:', dateOfBirth);
    return null;
  }
  return parsedDate.toISOString();
};

// Профайлын өгөгдлийг форматлах
const formatProfile = (profile: Profile, graphqlGender: Gender, dateOfBirth: string | null) => ({
  id: profile._id.toHexString(),
  userId: profile.userId.toHexString(),
  name: profile.name,
  gender: graphqlGender,
  bio: profile.bio,
  interests: profile.interests,
  profession: profile.profession,
  work: profile.work,
  images: profile.images,
  dateOfBirth,
  createdAt: profile.createdAt.toISOString(),
  updatedAt: profile.updatedAt.toISOString(),
  likes: [],
  matches: [],
});

export const getProfile = async (
  _: unknown,
  { userId }: GetProfileArgs,
  context: unknown,
  info: unknown
) => {
  // userId-ийн форматыг шалгах
  if (!Types.ObjectId.isValid(userId)) {
    throw new GraphQLError(ERRORS.INVALID_USER_ID, {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }

  try {
    // Профайлыг татах
    const profile = await ProfileModel.findOne({ userId: new Types.ObjectId(userId) });
    if (!profile) {
      throw new GraphQLError(ERRORS.PROFILE_NOT_FOUND, {
        extensions: { code: 'NOT_FOUND', http: { status: 404 } },
      });
    }

    // Gender болон dateOfBirth зохицуулах
    const graphqlGender = mapGenderToGraphQL(profile.gender);
    const dateOfBirth = parseDateOfBirth(profile.dateOfBirth);

    // Профайлын өгөгдлийг буцаах
    return formatProfile(profile, graphqlGender, dateOfBirth);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : ERRORS.FETCH_FAILED;
    throw new GraphQLError(message, {
      extensions: { code: 'INTERNAL_SERVER_ERROR' },
    });
  }
};