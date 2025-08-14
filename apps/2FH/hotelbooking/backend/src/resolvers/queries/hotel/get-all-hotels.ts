import { QueryResolvers, Amenity } from 'src/generated';
import { HotelModel } from 'src/models';

// Map Mongoose enum values to GraphQL enum values
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

export const hotels: QueryResolvers['hotels'] = async () => {
  try {
    const hotels = await HotelModel.find({});
    
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
    console.error('Failed to fetch hotels:', error);
    throw new Error('Failed to fetch hotels');
  }
};
