'use client';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';

interface BasicInfoSectionProps {
  formData: any;
  handleInputChange: (_field: string, _value: any) => void;
}

export const BasicInfoSection = ({ formData, handleInputChange }: BasicInfoSectionProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name" className="text-sm font-medium text-gray-700">
          Hotel Name
        </Label>
        <Input id="name" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} />
      </div>
      <div>
        <Label htmlFor="description" className="text-sm font-medium text-gray-700">
          Description
        </Label>
        <Textarea id="description" value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} rows={4} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
            Phone Number
          </Label>
          <Input id="phone" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} />
        </div>
        <div>
          <Label htmlFor="stars" className="text-sm font-medium text-gray-700">
            Stars (Read-only)
          </Label>
          <Input id="stars" type="number" min="1" max="5" value={formData.stars} disabled className="bg-gray-100" />
        </div>
      </div>
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
      <div>
        <Label htmlFor="rating" className="text-sm font-medium text-gray-700">
          User Rating (Read-only)
        </Label>
        <Input id="rating" type="number" step="0.1" min="0" max="10" value={formData.rating} disabled className="bg-gray-100" />
      </div>
    </div>
  );
};
