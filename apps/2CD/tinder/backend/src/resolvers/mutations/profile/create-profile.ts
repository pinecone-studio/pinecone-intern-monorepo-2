import { CreateProfileArgs } from 'src/types/profile';
import { Profile } from '../../../models/profile';

export const createProfile = async (_: unknown, { input }: CreateProfileArgs) => {
  const profile = new Profile(input);
  await profile.save();
  return profile;
}; 