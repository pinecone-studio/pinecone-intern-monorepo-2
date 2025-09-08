'use client';
import React, { useState } from 'react';
import { useUpdateBookingMutation } from '@/generated';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface CheckoutModalProps {
  bookingId: string;
  currentStatus: string;
  onStatusUpdate?: () => void;
}

const CheckoutModal = ({ bookingId, currentStatus, onStatusUpdate }: CheckoutModalProps) => {
  const [open, setOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [updateBooking, { loading }] = useUpdateBookingMutation();

  const statusOptions = [
    { value: 'BOOKED', label: 'Booked', color: 'bg-blue-600 text-white' },
    { value: 'COMPLETED', label: 'Completed', color: 'bg-green-600 text-white' },
    { value: 'CANCELLED', label: 'Cancelled', color: 'bg-orange-500 text-white' },
  ];

  const handleStatusUpdate = async () => {
    try {
      await updateBooking({
        variables: {
          updateBookingId: bookingId,
          input: {
            status: selectedStatus as any,
          },
        },
      });

      setOpen(false);
      onStatusUpdate?.();
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">Change Status</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Booking Status</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <Label className="text-sm font-medium text-gray-600 mb-3 block">Current Status</Label>
            <Badge className={statusOptions.find((s) => s.value === currentStatus)?.color || 'bg-gray-600 text-white'}>{currentStatus.charAt(0) + currentStatus.slice(1).toLowerCase()}</Badge>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-600 mb-3 block">Select New Status</Label>
            <RadioGroup value={selectedStatus} onValueChange={setSelectedStatus} className="space-y-3">
              {statusOptions.map((status) => (
                <div key={status.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={status.value} id={status.value} />
                  <Label htmlFor={status.value} className="flex items-center gap-2 cursor-pointer">
                    <Badge className={status.color}>{status.label}</Badge>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleStatusUpdate} disabled={loading || selectedStatus === currentStatus} className="bg-blue-600 hover:bg-blue-700 text-white">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Status
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;
