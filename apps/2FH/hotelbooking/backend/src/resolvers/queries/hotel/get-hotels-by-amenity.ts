import { QueryResolvers, Amenity } from 'src/generated';
import { HotelModel } from 'src/models';

const mapGraphQLToMongooseAmenity = (amenity: Amenity): string => {
  const mapping: Record<Amenity, string> = {
    [Amenity.Pool]: 'pool',
    [Amenity.Gym]: 'gym',
    [Amenity.Restaurant]: 'restaurant',
    [Amenity.Bar]: 'bar',
    [Amenity.Wifi]: 'wifi',
    [Amenity.Parking]: 'parking',
    [Amenity.FitnessCenter]: 'fitness_center',
    [Amenity.BusinessCenter]: 'business_center',
    [Amenity.MeetingRooms]: 'meeting_rooms',
    [Amenity.ConferenceRooms]: 'conference_rooms',
    [Amenity.RoomService]: 'room_service',
    [Amenity.AirConditioning]: 'air_conditioning',
    [Amenity.AirportTransfer]: 'airport_transfer',
    [Amenity.FreeWifi]: 'free_wifi',
    [Amenity.FreeParking]: 'free_parking',
    [Amenity.FreeCancellation]: 'free_cancellation',
    [Amenity.Spa]: 'spa',
    [Amenity.PetsAllowed]: 'pets_allowed',
    [Amenity.SmokingAllowed]: 'smoking_allowed',
    [Amenity.LaundryFacilities]: 'laundry_facilities',
  };
  return mapping[amenity];
};

// Map Mongoose enum values to GraphQL enum values for response
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

export const hotelsByAmenity: QueryResolvers['hotelsByAmenity'] = async (_, { amenity }) => {
  try {
    const mongooseAmenity = mapGraphQLToMongooseAmenity(amenity);
    
    const hotels = await HotelModel.find({ 
      amenities: mongooseAmenity 
    });
    
    return hotels.map(hotel => {
      const hotelObj = hotel.toObject();
      return {
        ...hotelObj,
        id: hotelObj._id.toString(),
        amenities: hotelObj.amenities.map(mapAmenityToGraphQL),
        _id: undefined,
      };
    });
  } catch (error) {
    console.error('Failed to fetch hotels by amenity:', error);
    throw new Error('Failed to fetch hotels by amenity');
  }
}; 