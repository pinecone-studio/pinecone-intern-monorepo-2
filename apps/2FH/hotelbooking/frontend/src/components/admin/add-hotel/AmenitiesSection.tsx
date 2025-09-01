import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';
import { Amenity } from '@/generated';

export const AmenitiesSection = ({ amenities, onAmenitiesChange }: { amenities: Amenity[]; onAmenitiesChange: (_amenities: Amenity[]) => void }) => {
  const handleAmenityChange = (amenity: Amenity, checked: boolean) => {
    if (checked) {
      onAmenitiesChange([...amenities, amenity]);
    } else {
      onAmenitiesChange(amenities.filter((a) => a !== amenity));
    }
  };

  const amenityOptions = Object.values(Amenity);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star size={20} className="text-purple-500" />
          Amenities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-60 overflow-y-auto">
          {amenityOptions.map((amenity) => (
            <div key={amenity} className="flex items-center space-x-2">
              <Checkbox id={amenity} checked={amenities.includes(amenity)} onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)} />
              <Label htmlFor={amenity} className="text-sm">
                {amenity.replace(/_/g, ' ')}
              </Label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
