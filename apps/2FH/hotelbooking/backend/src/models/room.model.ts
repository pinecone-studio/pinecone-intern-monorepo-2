/* eslint-disable no-unused-vars */
import { Schema, model, models, Model, Types } from 'mongoose';

type roomType = {
  hotelId: Types.ObjectId;
  name: string;
  images: string[];
  pricePerNight: number;
  typePerson: typePerson;
  roomInformation: roomInformation;
  bathroom: bathroom;
  accessibility: accessibility;
  internet: internet;
  foodAndDrink: foodAndDrink;
  bedRoom: bedRoom;
  other: other;
  entertainment: entertainment;
  bedNumber: number;
  status: status;
};

enum typePerson {
  SINGLE = 'single',
  DOUBLE = 'double',
  TRIPLE = 'triple',
  QUAD = 'quad',
  QUEEN = 'queen',
  KING = 'king',
}

enum roomInformation {
  PRIVATE_BATHROOM = 'private_bathroom',
  SHARED_BATHROOM = 'shared_bathroom',
  FREE_BOTTLE_WATER = 'free_bottle_water',
  AIR_CONDITIONER = 'air_conditioner',
  TV = 'tv',
  MINIBAR = 'minibar',
  FREE_WIFI = 'free_wifi',
  FREE_PARKING = 'free_parking',
  SHOWER = 'shower',
  BATHTUB = 'bathtub',
  HAIR_DRYER = 'hair_dryer',
  DESK = 'desk',
  ELEVATOR = 'elevator',
}

enum bathroom {
  PRIVATE = 'private',
  SHARED = 'shared',
  BATHROBES = 'bathrobes',
  FREE_TOILETRIES = 'free_toiletries',
  HAIR_DRYER = 'hair_dryer',
  FREE_SHAMPOO = 'free_shampoo',
  FREE_CONDITIONER = 'free_conditioner',
  FREE_BODY_WASH = 'free_body_wash',
  FREE_BODY_LOTION = 'free_body_lotion',
  FREE_BODY_SOAP = 'free_body_soap',
  FREE_BODY_SCRUB = 'free_body_scrub',
  FREE_BODY_MASK = 'free_body_mask',
  TOWELS = 'towels',
  SLIPPERS = 'slippers',
  TOOTHBRUSH = 'toothbrush',
  TOOTHPASTE = 'toothpaste',
}

enum accessibility {
  WHEELCHAIR_ACCESSIBLE = 'wheelchair_accessible',
  WHEELCHAIR_ACCESSIBLE_BATHROOM = 'wheelchair_accessible_bathroom',
  WHEELCHAIR_ACCESSIBLE_SHOWER = 'wheelchair_accessible_shower',
  WHEELCHAIR_ACCESSIBLE_BATHTUB = 'wheelchair_accessible_bathtub',
  WHEELCHAIR_ACCESSIBLE_DOOR = 'wheelchair_accessible_door',
  WHEELCHAIR_ACCESSIBLE_ENTRANCE = 'wheelchair_accessible_entrance',
  WHEELCHAIR_ACCESSIBLE_PARKING = 'wheelchair_accessible_parking',
  THIN_CARPET = 'thin_carpet',
  ACCESS_VIA_EXTERIOR_CORRIDORS = 'access_via_exterior_corridors',
}

enum internet {
  FREE_WIFI = 'free_wifi',
  FREE_WIRED_INTERNET = 'free_wired_internet',
}

enum foodAndDrink {
  FREE_BREAKFAST = 'free_breakfast',
  FREE_LUNCH = 'free_lunch',
  FREE_DINNER = 'free_dinner',
  FREE_SNACKS = 'free_snacks',
  FREE_DRINKS = 'free_drinks',
  ELECTRIC_KETTLE = 'electric_kettle',
  COFFEE_MACHINE = 'coffee_machine',
  MINIBAR = 'minibar',
}

enum bedRoom {
  AIR_CONDITIONER = 'air_conditioner',
  BED_SHEETS = 'bed_sheets',
  PILLOWS = 'pillows',
  BLANKETS = 'blankets',
  CRIB = 'crib',
  CRIB_NOT_AVAILABLE = 'crib_not_available',
  HEATING = 'heating',
}
enum other {
  DAILY_HOUSEKEEPING = 'daily_housekeeping',
  DESK = 'desk',
  LAPTOP_WORKSPACE = 'laptop_workspace',
  LAPTOP_WORKSPACE_NOT_AVAILABLE = 'laptop_workspace_not_available',
  PHONE = 'phone',
  SAFE = 'safe',
  SITTING_AREA = 'sitting_area',
  SOUNDPROOFED_ROOMS = 'soundproofed_rooms',
  WARDROBES = 'wardrobes',
}
enum entertainment {
  TV = 'tv',
  CABLE_CHANNELS = 'cable_channels',
  DVD_PLAYER = 'dvd_player',
  ADULT_MOVIES = 'adult_movies',
  COMPUTER = 'computer',
  CONSOLE_FREE = 'console_free',
}

enum status {
  Cancelled = 'Cancelled',
  Booked = 'Booked',
  Pending = 'Pending',
  Completed = 'Completed',
  Available = 'Available',
}

const roomSchema = new Schema<roomType>(
  {
    hotelId: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true },
    name: { type: String, required: true },
    images: { type: [String], required: true },
    pricePerNight: { type: Number, required: true },
    typePerson: { type: String, enum: Object.values(typePerson), required: true },
    roomInformation: [{ type: String, enum: Object.values(roomInformation), required: true }],
    bathroom: [{ type: String, enum: Object.values(bathroom), required: true }],
    accessibility: [{ type: String, enum: Object.values(accessibility), required: true }],
    internet: [{ type: String, enum: Object.values(internet), required: true }],
    foodAndDrink: [{ type: String, enum: Object.values(foodAndDrink), required: true }],
    bedRoom: [{ type: String, enum: Object.values(bedRoom), required: true }],
    other: [{ type: String, enum: Object.values(other), required: true }],
    entertainment: [{ type: String, enum: Object.values(entertainment), required: true }],
    bedNumber: { type: Number, required: true },
    status: { type: String, enum: Object.values(status), default: status.Available },
  },
  { timestamps: true }
);

export const RoomModel: Model<roomType> = models['Room'] || model('Room', roomSchema);
