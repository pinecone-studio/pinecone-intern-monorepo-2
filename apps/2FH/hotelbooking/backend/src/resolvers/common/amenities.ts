import { Amenity } from 'src/generated';

export const mapAmenityToGraphQL = (amenity: string): Amenity => {
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

export const mapGraphQLToMongooseAmenity = (amenity: string | Amenity): string => {
  const mapping: Record<string, string> = {
    POOL: 'pool',
    GYM: 'gym',
    RESTAURANT: 'restaurant',
    BAR: 'bar',
    WIFI: 'wifi',
    PARKING: 'parking',
    FITNESS_CENTER: 'fitness_center',
    BUSINESS_CENTER: 'business_center',
    MEETING_ROOMS: 'meeting_rooms',
    CONFERENCE_ROOMS: 'conference_rooms',
    ROOM_SERVICE: 'room_service',
    AIR_CONDITIONING: 'air_conditioning',
    AIRPORT_TRANSFER: 'airport_transfer',
    FREE_WIFI: 'free_wifi',
    FREE_PARKING: 'free_parking',
    FREE_CANCELLATION: 'free_cancellation',
    SPA: 'spa',
    PETS_ALLOWED: 'pets_allowed',
    SMOKING_ALLOWED: 'smoking_allowed',
    LAUNDRY_FACILITIES: 'laundry_facilities',
  };
  return mapping[amenity] || amenity;
};
