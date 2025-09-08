/* eslint-disable  */
'use client';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface AmenitiesSectionProps {
  room: any;
  handleInputChange: (field: string, value: any) => void;
}

export const AmenitiesSection = ({ room, handleInputChange }: AmenitiesSectionProps) => {
  const internetOptions = [
    { value: 'free_wifi', label: 'Free WiFi' },
    { value: 'free_wired_internet', label: 'Free Wired Internet' },
  ];

  const foodAndDrinkOptions = [
    { value: 'free_breakfast', label: 'Free Breakfast' },
    { value: 'free_lunch', label: 'Free Lunch' },
    { value: 'free_dinner', label: 'Free Dinner' },
    { value: 'free_snacks', label: 'Free Snacks' },
    { value: 'free_drinks', label: 'Free Drinks' },
    { value: 'electric_kettle', label: 'Electric Kettle' },
    { value: 'coffee_machine', label: 'Coffee Machine' },
    { value: 'minibar', label: 'Minibar' },
  ];

  const bedRoomOptions = [
    { value: 'air_conditioner', label: 'Air Conditioner' },
    { value: 'bed_sheets', label: 'Bed Sheets' },
    { value: 'pillows', label: 'Pillows' },
    { value: 'blankets', label: 'Blankets' },
    { value: 'crib', label: 'Crib' },
    { value: 'crib_not_available', label: 'Crib Not Available' },
    { value: 'heating', label: 'Heating' },
  ];

  const bathroomOptions = [
    { value: 'private', label: 'Private' },
    { value: 'shared', label: 'Shared' },
    { value: 'bathrobes', label: 'Bathrobes' },
    { value: 'free_toiletries', label: 'Free Toiletries' },
    { value: 'hair_dryer', label: 'Hair Dryer' },
    { value: 'free_shampoo', label: 'Free Shampoo' },
    { value: 'free_conditioner', label: 'Free Conditioner' },
    { value: 'free_body_wash', label: 'Free Body Wash' },
    { value: 'free_body_lotion', label: 'Free Body Lotion' },
    { value: 'free_body_soap', label: 'Free Body Soap' },
    { value: 'free_body_scrub', label: 'Free Body Scrub' },
    { value: 'free_body_mask', label: 'Free Body Mask' },
    { value: 'towels', label: 'Towels' },
    { value: 'slippers', label: 'Slippers' },
    { value: 'toothbrush', label: 'Toothbrush' },
    { value: 'toothpaste', label: 'Toothpaste' },
  ];

  const accessibilityOptions = [
    { value: 'wheelchair_accessible', label: 'Wheelchair Accessible' },
    { value: 'wheelchair_accessible_bathroom', label: 'Wheelchair Accessible Bathroom' },
    { value: 'wheelchair_accessible_shower', label: 'Wheelchair Accessible Shower' },
    { value: 'wheelchair_accessible_bathtub', label: 'Wheelchair Accessible Bathtub' },
    { value: 'wheelchair_accessible_door', label: 'Wheelchair Accessible Door' },
    { value: 'wheelchair_accessible_entrance', label: 'Wheelchair Accessible Entrance' },
    { value: 'wheelchair_accessible_parking', label: 'Wheelchair Accessible Parking' },
    { value: 'thin_carpet', label: 'Thin Carpet' },
    { value: 'access_via_exterior_corridors', label: 'Access Via Exterior Corridors' },
  ];

  const entertainmentOptions = [
    { value: 'tv', label: 'TV' },
    { value: 'cable_channels', label: 'Cable Channels' },
    { value: 'dvd_player', label: 'DVD Player' },
    { value: 'adult_movies', label: 'Adult Movies' },
    { value: 'computer', label: 'Computer' },
    { value: 'console_free', label: 'Console Free' },
  ];

  const otherOptions = [
    { value: 'daily_housekeeping', label: 'Daily Housekeeping' },
    { value: 'desk', label: 'Desk' },
    { value: 'laptop_workspace', label: 'Laptop Workspace' },
    { value: 'laptop_workspace_not_available', label: 'Laptop Workspace Not Available' },
    { value: 'phone', label: 'Phone' },
    { value: 'safe', label: 'Safe' },
    { value: 'sitting_area', label: 'Sitting Area' },
    { value: 'soundproofed_rooms', label: 'Soundproofed Rooms' },
    { value: 'wardrobes', label: 'Wardrobes' },
  ];

  const renderCheckboxGroup = (field: string, options: any[], label: string) => {
    const currentValues = Array.isArray(room[field]) ? room[field] : [];

    return (
      <div>
        <Label>{label}</Label>
        <div className="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto mt-2">
          {options.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={`${field}-${option.value}`}
                checked={currentValues.includes(option.value)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    handleInputChange(field, [...currentValues, option.value]);
                  } else {
                    handleInputChange(
                      field,
                      currentValues.filter((v: string) => v !== option.value)
                    );
                  }
                }}
              />
              <Label htmlFor={`${field}-${option.value}`} className="text-sm">
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {renderCheckboxGroup('internet', internetOptions, 'Internet')}
      {renderCheckboxGroup('foodAndDrink', foodAndDrinkOptions, 'Food & Drink')}
      {renderCheckboxGroup('bedRoom', bedRoomOptions, 'Bedroom')}
      {renderCheckboxGroup('bathroom', bathroomOptions, 'Bathroom')}
      {renderCheckboxGroup('accessibility', accessibilityOptions, 'Accessibility')}
      {renderCheckboxGroup('entertainment', entertainmentOptions, 'Entertainment')}
      {renderCheckboxGroup('other', otherOptions, 'Other Amenities')}
    </div>
  );
};
