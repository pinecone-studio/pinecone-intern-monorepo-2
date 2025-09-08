/* eslint-disable  */
'use client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface BasicInfoSectionProps {
  room: any;
  handleInputChange: (field: string, value: any) => void;
}

export const BasicInfoSection = ({ room, handleInputChange }: BasicInfoSectionProps) => {
  const typePersonOptions = [
    { value: 'single', label: 'Single' },
    { value: 'double', label: 'Double' },
    { value: 'triple', label: 'Triple' },
    { value: 'quad', label: 'Quad' },
    { value: 'queen', label: 'Queen' },
    { value: 'king', label: 'King' },
  ];

  const roomInformationOptions = [
    { value: 'private_bathroom', label: 'Private Bathroom' },
    { value: 'shared_bathroom', label: 'Shared Bathroom' },
    { value: 'free_bottle_water', label: 'Free Bottle Water' },
    { value: 'air_conditioner', label: 'Air Conditioner' },
    { value: 'tv', label: 'TV' },
    { value: 'minibar', label: 'Minibar' },
    { value: 'free_wifi', label: 'Free WiFi' },
    { value: 'free_parking', label: 'Free Parking' },
    { value: 'shower', label: 'Shower' },
    { value: 'bathtub', label: 'Bathtub' },
    { value: 'hair_dryer', label: 'Hair Dryer' },
    { value: 'desk', label: 'Desk' },
    { value: 'elevator', label: 'Elevator' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="name">Room Name</Label>
        <Input id="name" value={room.name || ''} onChange={(e) => handleInputChange('name', e.target.value)} placeholder="Enter room name" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="pricePerNight">Price per Night ($)</Label>
          <Input id="pricePerNight" type="number" value={room.pricePerNight || ''} onChange={(e) => handleInputChange('pricePerNight', parseFloat(e.target.value) || 0)} placeholder="0.00" />
        </div>

        <div>
          <Label htmlFor="typePerson">Room Type</Label>
          <Select value={room.typePerson || ''} onValueChange={(value) => handleInputChange('typePerson', value)}>
            <SelectTrigger id="typePerson">
              <SelectValue placeholder="Select room type" />
            </SelectTrigger>
            <SelectContent>
              {typePersonOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="bedNumber">Number of Beds</Label>
        <Input id="bedNumber" type="number" value={room.bedNumber || ''} onChange={(e) => handleInputChange('bedNumber', parseInt(e.target.value) || 0)} placeholder="1" />
      </div>

      <div>
        <Label>Room Information</Label>
        <div className="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto mt-2">
          {roomInformationOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={option.value}
                checked={Array.isArray(room.roomInformation) ? room.roomInformation.includes(option.value) : false}
                onCheckedChange={(checked) => {
                  const currentValues = Array.isArray(room.roomInformation) ? room.roomInformation : [];
                  if (checked) {
                    handleInputChange('roomInformation', [...currentValues, option.value]);
                  } else {
                    handleInputChange(
                      'roomInformation',
                      currentValues.filter((v: string) => v !== option.value)
                    );
                  }
                }}
              />
              <Label htmlFor={option.value} className="text-sm">
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
