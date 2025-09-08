/* eslint-disable  */ 
'use client';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DetailsSectionProps {
  room: any;
  handleInputChange: (field: string, value: any) => void;
}

export const DetailsSection = ({ room, handleInputChange }: DetailsSectionProps) => {
  const statusOptions = [
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'booked', label: 'Booked' },
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
    { value: 'available', label: 'Available' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="roomInformation">Room Information</Label>
        <textarea
          id="roomInformation"
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={6}
          value={room.roomInformation || ''}
          onChange={(e) => handleInputChange('roomInformation', e.target.value)}
          placeholder="Enter detailed room information, policies, and any special notes..."
        />
      </div>

      <div>
        <Label htmlFor="status">Room Status</Label>
        <Select value={room.status || 'available'} onValueChange={(value) => handleInputChange('status', value)}>
          <SelectTrigger id="status">
            <SelectValue placeholder="Select room status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
