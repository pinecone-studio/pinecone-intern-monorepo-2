import { QueryResolvers } from 'src/generated';
import { ArtistModel } from 'src/models';

export const getArtists: QueryResolvers['getArtists'] = async (_, { name }) => {
  const filter = name ? { name: { $regex: name, $options: 'i' } } : {};
  const artist = await ArtistModel.find(filter);
  return artist;
};
