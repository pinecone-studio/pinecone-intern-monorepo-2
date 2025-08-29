'use client';
import { TypePerson, RoomInformation } from '@/generated';
interface GeneralFormProps {
  formData: FormData;
  errors: Record<string, string>;
  onInputChange: (_field: keyof FormData, _value: string | string[]) => void;
}
interface FormData {
  name: string;
  type: string[];
  pricePerNight: string;
  roomInformation: string[];
  bedNumber: number;
}
const TYPE_OPTIONS = [
  { value: TypePerson.Single, label: 'Single' },
  { value: TypePerson.Double, label: 'Double' },
  { value: TypePerson.Triple, label: 'Triple' },
  { value: TypePerson.Quad, label: 'Quad' },
  { value: TypePerson.Queen, label: 'Queen' },
  { value: TypePerson.King, label: 'King' },
];
const ROOM_OPTIONS = [
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
export const NameField = ({ formData, errors, onInputChange }: GeneralFormProps) => (
  <div>
    <label htmlFor="room-name" className="block text-sm font-medium text-gray-700 mb-1">
      Name
    </label>
    <input
      id="room-name"
      type="text"
      value={formData.name}
      onChange={(e) => onInputChange('name', e.target.value)}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
        errors.name ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
      }`}
      placeholder="Enter room name"
    />
    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
  </div>
);
export const TypeField = ({ formData, errors, onInputChange }: GeneralFormProps) => (
  <div>
    <label htmlFor="room-type" className="block text-sm font-medium text-gray-700 mb-1">
      Type
    </label>
    <div className="relative">
      <select
        id="room-type"
        value={formData.type[0] || ''}
        onChange={(e) => onInputChange('type', [e.target.value])}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent appearance-none bg-white ${
          errors.type ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
        }`}
      >
        <option value="">Select room type</option>
        {TYPE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
    {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
  </div>
);
export const PriceField = ({ formData, errors, onInputChange }: GeneralFormProps) => (
  <div>
    <label htmlFor="room-price" className="block text-sm font-medium text-gray-700 mb-1">
      Price per night
    </label>
    <input
      id="room-price"
      type="number"
      value={formData.pricePerNight}
      onChange={(e) => onInputChange('pricePerNight', e.target.value)}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
        errors.pricePerNight ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
      }`}
      placeholder="Enter price"
      min="0"
      step="100"
    />
    {errors.pricePerNight && <p className="mt-1 text-sm text-red-600">{errors.pricePerNight}</p>}
  </div>
);
export const BedNumberField = ({ formData, errors, onInputChange }: GeneralFormProps) => (
  <div>
    <label htmlFor="bed-number" className="block text-sm font-medium text-gray-700 mb-1">
      Bed number
    </label>
    <input
      id="bed-number"
      type="number"
      value={formData.bedNumber ?? ''}
      onChange={(e) => onInputChange('bedNumber', e.target.value)}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent ${
        errors.bedNumber ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
      }`}
      placeholder="1"
      min="0"
      step="1"
    />
    {errors.bedNumber && <p className="mt-1 text-sm text-red-600">{errors.bedNumber}</p>}
  </div>
);
export const RoomInformationField = ({ formData, errors, onInputChange }: GeneralFormProps) => {
  const handleCheckboxChange = (optionValue: string, checked: boolean) => {
    if (checked) {
      onInputChange('roomInformation', [...formData.roomInformation, optionValue]);
    } else {
      onInputChange(
        'roomInformation',
        formData.roomInformation.filter((item) => item !== optionValue)
      );
    }
  };
  return (
    <div>
      <label htmlFor="room-information" className="block text-sm font-medium text-gray-700 mb-2">
        Room information
      </label>
      <div id="room-information" className={`grid grid-cols-2 gap-2 max-h-32 overflow-y-auto p-2 rounded-md border ${errors.roomInformation ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
        {ROOM_OPTIONS.map((option) => (
          <label key={option.value} className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              id={`room-info-${option.value}`}
              checked={formData.roomInformation.includes(option.value)}
              onChange={(e) => handleCheckboxChange(option.value, e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      {errors.roomInformation && <p className="mt-1 text-sm text-red-600">{errors.roomInformation}</p>}
    </div>
  );
};
