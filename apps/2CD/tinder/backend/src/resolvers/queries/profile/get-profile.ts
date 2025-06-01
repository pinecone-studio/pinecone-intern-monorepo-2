import { Profile } from '../../../models/profile';

interface GetProfileArgs {
  id: string;
}

export const getProfile = async (_: unknown, { id }: GetProfileArgs) => {
  const profile = await Profile.findById(id);
  return profile;
}; 