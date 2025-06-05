import { Profile } from '../../../models/profile';

export interface CreateProfileInput {
  userId: string;
  firstName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  lookingFor: 'Male' | 'Female' | 'Both';
  bio: string;
  interests: string[];
  profession: string;
  education: string;
  images: string[];
  isCertified: boolean;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
}

interface CreateProfileArgs {
  input: CreateProfileInput;
}

export const createProfile = async (_: unknown, { input }: CreateProfileArgs) => {
  const profile = new Profile(input);
  await profile.save();
  return profile;
}; 