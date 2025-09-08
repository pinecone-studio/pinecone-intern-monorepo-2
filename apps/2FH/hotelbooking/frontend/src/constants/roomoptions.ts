import { TypePerson } from '@/generated';

import { RoomInformation } from '@/generated';

export const TYPE_OPTIONS = [
  { value: TypePerson.Single, label: 'Single' },
  { value: TypePerson.Double, label: 'Double' },
  { value: TypePerson.Triple, label: 'Triple' },
  { value: TypePerson.Quad, label: 'Quad' },
  { value: TypePerson.Queen, label: 'Queen' },
  { value: TypePerson.King, label: 'King' },
];

export const ROOM_OPTIONS = [
  { value: RoomInformation.PrivateBathroom, label: 'Private Bathroom' },
  { value: RoomInformation.SharedBathroom, label: 'Shared Bathroom' },
  { value: RoomInformation.FreeBottleWater, label: 'Free Bottle Water' },
  { value: RoomInformation.AirConditioner, label: 'Air Conditioner' },
  { value: RoomInformation.Tv, label: 'TV' },
  { value: RoomInformation.Minibar, label: 'Minibar' },
  { value: RoomInformation.FreeWifi, label: 'Free WiFi' },
  { value: RoomInformation.FreeParking, label: 'Free Parking' },
  { value: RoomInformation.Shower, label: 'Shower' },
  { value: RoomInformation.Bathtub, label: 'Bathtub' },
  { value: RoomInformation.HairDryer, label: 'Hair Dryer' },
  { value: RoomInformation.Desk, label: 'Desk' },
  { value: RoomInformation.Elevator, label: 'Elevator' },
];

export interface FormData {
  name: string;
  type: string[];
  pricePerNight: string;
  roomInformation: string[];
  bedNumber: number;
  status: string;
}
