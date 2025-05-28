import { MutationResolvers, Response } from 'src/generated';
import { ArtistModel } from 'src/models/artist.model';
import { artistSchema } from 'src/zodSchemas/artist.zod';

export const createArtist: MutationResolvers['createArtist'] = async (__, { input }) => {
  const data = artistSchema.parse(input);
  await ArtistModel.create(data);
  return Response.Success;
};
