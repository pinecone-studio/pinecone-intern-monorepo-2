import { Profile } from '../../../models/profile';

export interface CreateProfileInput {
  userId: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  lookingFor: 'Male' | 'Female' | 'Both';
  bio: string;
  images: string[];
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