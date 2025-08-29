'use client';
import { Label } from '@/components/ui/Label';
import { Checkbox } from '@/components/ui/Checkbox';

interface AmenitiesSectionProps {
  formData: any;
  handleInputChange: (_field: string, _value: any) => void;
}

export const AmenitiesSection = ({ formData, handleInputChange }: AmenitiesSectionProps) => {
  const availableAmenities = [
    'POOL',
    'GYM',
    'RESTAURANT',
    'BAR',
    'WIFI',
    'PARKING',
    'FITNESS_CENTER',
    'BUSINESS_CENTER',
    'MEETING_ROOMS',
    'CONFERENCE_ROOMS',
    'ROOM_SERVICE',
    'AIR_CONDITIONING',
    'AIRPORT_TRANSFER',
    'FREE_WIFI',
    'FREE_PARKING',
    'FREE_CANCELLATION',
    'SPA',
    'PETS_ALLOWED',
    'SMOKING_ALLOWED',
    'LAUNDRY_FACILITIES',
  ];

  return (
    <div className="space-y-4">
      <Label>Amenities</Label>
      <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto">
        {availableAmenities.map((amenity) => (
          <div key={amenity} className="flex items-center space-x-2">
            <Checkbox
              id={amenity}
              checked={formData.amenities.includes(amenity)}
              onCheckedChange={(checked) => {
                if (checked) {
                  handleInputChange('amenities', [...formData.amenities, amenity]);
                } else {
                  handleInputChange(
                    'amenities',
                    formData.amenities.filter((a: string) => a !== amenity)
                  );
                }
              }}
            />
            <Label htmlFor={amenity} className="text-sm">
              {amenity.replace(/_/g, ' ')}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};
