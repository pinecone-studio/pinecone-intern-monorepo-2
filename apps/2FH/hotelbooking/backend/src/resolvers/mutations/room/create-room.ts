import { GraphQLError } from 'graphql';
import { RoomModel } from 'src/models';
import { MutationResolvers, RoomInput, Response } from 'src/generated';

export const createRoom: MutationResolvers['createRoom'] = async (_: unknown, { input }: { input: RoomInput }) => {
  try {
    await RoomModel.create(input);
    return Response.Success;
  } catch (error) {
    console.error(error);
    throw new GraphQLError('Cannot create room');
  }
};
