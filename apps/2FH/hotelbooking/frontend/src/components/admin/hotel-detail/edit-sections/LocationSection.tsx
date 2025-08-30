'use client';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';

interface LocationSectionProps {
  formData: any;
  handleInputChange: (_field: string, _value: any) => void;
}

export const LocationSection = ({ formData, handleInputChange }: LocationSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="country" className="text-sm font-medium text-gray-700">
            Country
          </Label>
          <Input id="country" value={formData.country} onChange={(e) => handleInputChange('country', e.target.value)} placeholder="Enter country..." />
        </div>
        <div>
          <Label htmlFor="city" className="text-sm font-medium text-gray-700">
            City
          </Label>
          <Input id="city" value={formData.city} onChange={(e) => handleInputChange('city', e.target.value)} placeholder="Enter city name..." />
        </div>
      </div>
      <div>
        <Label htmlFor="location" className="text-sm font-medium text-gray-700">
          Location
        </Label>
        <Input id="location" value={formData.location} onChange={(e) => handleInputChange('location', e.target.value)} />
      </div>
    </div>
  );
};
