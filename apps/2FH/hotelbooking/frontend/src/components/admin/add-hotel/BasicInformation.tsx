import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { Star } from 'lucide-react';
import { FormData } from './types';

export const BasicInformation = ({ formData, onInputChange }: { formData: FormData; onInputChange: (_field: keyof FormData, _value: string | number) => void }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Star size={20} className="text-yellow-500" />
        General Information
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="name">Hotel Name *</Label>
          <Input id="name" value={formData.name} onChange={(e) => onInputChange('name', e.target.value)} placeholder="Enter hotel name" required />
        </div>

        <div>
          <Label htmlFor="phone">Phone Number *</Label>
          <Input id="phone" value={formData.phone} onChange={(e) => onInputChange('phone', e.target.value)} placeholder="Enter phone number" required />
        </div>

        <div>
          <Label htmlFor="city">City *</Label>
          <Input id="city" value={formData.city} onChange={(e) => onInputChange('city', e.target.value)} placeholder="Enter city" required />
        </div>

        <div>
          <Label htmlFor="country">Country *</Label>
          <Input id="country" value={formData.country} onChange={(e) => onInputChange('country', e.target.value)} placeholder="Enter country" required />
        </div>

        <div>
          <Label htmlFor="location">Location *</Label>
          <Input id="location" value={formData.location} onChange={(e) => onInputChange('location', e.target.value)} placeholder="Enter location/address" required />
        </div>

        <div>
          <Label htmlFor="stars">Star Rating *</Label>
          <Input id="stars" type="number" min="1" max="5" value={formData.stars} onChange={(e) => onInputChange('stars', parseInt(e.target.value))} required />
        </div>

        <div>
          <Label htmlFor="rating">User Rating *</Label>
          <Input id="rating" type="number" min="0" max="10" step="0.1" value={formData.rating} onChange={(e) => onInputChange('rating', parseFloat(e.target.value))} required />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea id="description" value={formData.description} onChange={(e) => onInputChange('description', e.target.value)} placeholder="Enter hotel description" rows={4} required />
      </div>
    </CardContent>
  </Card>
);
