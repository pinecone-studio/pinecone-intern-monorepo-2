import { GraphQLError } from 'graphql';
import { RoomModel } from 'src/models';
import { MutationResolvers, RoomInput, Response } from 'src/generated';

export const createRoom: MutationResolvers['createRoom'] = async (_: unknown, { input }: { input: RoomInput }) => {
  try {
    const validImageURLs = input.imageURL?.filter((url): url is string => url !== null && url !== undefined) || [];

    const roomData = {
      hotelId: input.hotelId,
      name: input.name,
      pricePerNight: input.pricePerNight,
      images: validImageURLs,
      typePerson: input.typePerson,
      roomInformation: input.roomInformation,
      bathroom: input.bathroom,
      accessibility: input.accessibility,
      internet: input.internet,
      foodAndDrink: input.foodAndDrink,
      bedRoom: input.bedRoom,
      other: input.other,
      entertainment: input.entertainment,
    };

    const createdRoom = await RoomModel.create(roomData);
    if (!createdRoom) {
      throw new GraphQLError('Failed to create room');
    }

    return Response.Success;
  } catch (error) {
    console.error('Error creating room:', error);
    throw new GraphQLError('Cannot create room');
  }
};
