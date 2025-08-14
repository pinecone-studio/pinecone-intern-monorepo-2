import { GraphQLError } from 'graphql';
import { QueryResolvers, Amenity } from 'src/generated';
import { HotelModel } from 'src/models';

const mapAmenityToGraphQL = (amenity: string): Amenity => {
  const mapping: Record<string, Amenity> = {
    'pool': Amenity.Pool,
    'gym': Amenity.Gym,
    'restaurant': Amenity.Restaurant,
    'bar': Amenity.Bar,
    'wifi': Amenity.Wifi,
    'parking': Amenity.Parking,
    'fitness_center': Amenity.FitnessCenter,
    'business_center': Amenity.BusinessCenter,
    'meeting_rooms': Amenity.MeetingRooms,
    'conference_rooms': Amenity.ConferenceRooms,
    'room_service': Amenity.RoomService,
    'air_conditioning': Amenity.AirConditioning,
    'airport_transfer': Amenity.AirportTransfer,
    'free_wifi': Amenity.FreeWifi,
    'free_parking': Amenity.FreeParking,
    'free_cancellation': Amenity.FreeCancellation,
    'spa': Amenity.Spa,
    'pets_allowed': Amenity.PetsAllowed,
    'smoking_allowed': Amenity.SmokingAllowed,
    'laundry_facilities': Amenity.LaundryFacilities,
  };
  return mapping[amenity] || Amenity.Wifi;
};

export const hotel: QueryResolvers['hotel'] = async (_, { id }) => {
  try {
    const hotel = await HotelModel.findById(id);
    
    if (!hotel) {
      throw new GraphQLError('Hotel not found', {
        extensions: {
          code: 'NOT_FOUND',
          http: {
            status: 404,
          },
        },
      });
    }

    const hotelObj = hotel.toObject();
    return {
      ...hotelObj,
      id: hotelObj._id.toString(),
      amenities: hotelObj.amenities.map(mapAmenityToGraphQL),
      _id: undefined,
    };
  } catch (error) {
    if (error instanceof GraphQLError) {
      throw error;
    }
    console.error('Failed to fetch hotel:', error);
    throw new GraphQLError('Failed to fetch hotel', {
      extensions: {
        code: 'INTERNAL_SERVER_ERROR',
        http: {
          status: 500,
        },
      },
    });
  }
}; 