import { GraphQLError } from 'graphql';
import { RoomModel } from 'src/models';
import { MutationResolvers, RoomInput, Response } from 'src/generated';

export const createRoom: MutationResolvers['createRoom'] = async (_: unknown, { input }: { input: RoomInput }) => {
  try {
    console.log('Creating room with input:', input);
    console.log('ImageURL from input:', input.imageURL);
    console.log('ImageURL type:', typeof input.imageURL);
    console.log('ImageURL is array:', Array.isArray(input.imageURL));
    console.log('ImageURL length:', input.imageURL?.length);

    const validImageURLs = input.imageURL?.filter((url): url is string => url !== null && url !== undefined) || [];

    console.log('Valid image URLs:', validImageURLs);
    console.log('Valid image URLs length:', validImageURLs.length);

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

    console.log('Room data to be saved:', roomData);
    console.log('Images field in roomData:', roomData.images);
    console.log('Images field length:', roomData.images.length);

    const createdRoom = await RoomModel.create(roomData);
    if (!createdRoom) {
      throw new GraphQLError('Failed to create room');
    }

    console.log('Room created successfully:', createdRoom);
    console.log('Created room images:', createdRoom.images);

    return Response.Success;
  } catch (error) {
    console.error('Error creating room:', error);
    throw new GraphQLError('Cannot create room');
  }
};
