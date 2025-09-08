'use client';
import React, { useState } from 'react';
import { useUpdateBookingMutation, BookingStatus, Response } from '@/generated';
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
  const [error, setError] = useState<string | null>(null);
  const [updateBooking, { loading }] = useUpdateBookingMutation();

  const statusOptions = [
    { value: BookingStatus.Booked, label: 'Booked', color: 'bg-blue-600 text-white' },
    { value: BookingStatus.Completed, label: 'Completed', color: 'bg-green-600 text-white' },
    { value: BookingStatus.Cancelled, label: 'Cancelled', color: 'bg-orange-500 text-white' },
  ];

  const handleStatusUpdate = async () => {
    try {
      setError(null);
      const result = await updateBooking({
        variables: {
          updateBookingId: bookingId,
          input: {
            status: selectedStatus as BookingStatus,
          },
        },
      });

      if (result.data?.updateBooking === Response.Success) {
        setOpen(false);
        onStatusUpdate?.();
      } else {
        setError('Failed to update booking status. Please try again.');
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      setError('An error occurred while updating the booking status. Please try again.');
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      setError(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

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
