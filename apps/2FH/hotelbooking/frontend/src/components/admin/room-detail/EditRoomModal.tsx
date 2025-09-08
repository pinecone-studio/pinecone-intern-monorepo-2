/* eslint-disable  */
'use client';
import { useState } from 'react';
import { useUpdateRoomMutation, Status, Response, RoomUpdateInput } from '@/generated';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { BasicInfoSection, AmenitiesSection, ImagesSection, DetailsSection } from './edit-sections';

interface EditRoomModalProps {
  room: any;
  section: 'basic' | 'amenities' | 'images' | 'details';
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  refetch: () => Promise<any>;
  roomId: string;
}

export const EditRoomModal = ({ room, section, isOpen, onOpenChange, refetch, roomId }: EditRoomModalProps) => {
  const [updateRoom, { loading: updateLoading }] = useUpdateRoomMutation();
  const [error, setError] = useState<string | null>(null);

  const normalizeStatus = (status: any): Status => {
    if (!status) return Status.Available;
    const statusStr = status.toString();

    // Map common variations to correct enum values
    switch (statusStr.toLowerCase()) {
      case 'available':
        return Status.Available;
      case 'booked':
        return Status.Booked;
      case 'cancelled':
        return Status.Cancelled;
      case 'completed':
        return Status.Completed;
      case 'pending':
        return Status.Pending;
      default:
        // If it's already a valid enum value, return it
        if (Object.values(Status).includes(statusStr as Status)) {
          return statusStr as Status;
        }
        return Status.Available;
    }
  };

  const [formData, setFormData] = useState(() => ({
    ...room,
    status: normalizeStatus(room.status),
    internet: room.internet || [],
    foodAndDrink: room.foodAndDrink || [],
    bedRoom: room.bedRoom || [],
    bathroom: room.bathroom || [],
    accessibility: room.accessibility || [],
    entertainment: room.entertainment || [],
    other: room.other || [],
    roomInformation: room.roomInformation || [],
    imageURL: room.imageURL || [],
  }));

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setError(null);

      const input: RoomUpdateInput = {
        bedNumber: formData.bedNumber || room.bedNumber,
        status: normalizeStatus(formData.status || room.status),
      };

      if (section === 'basic') {
        if (formData.name !== undefined) input.name = formData.name;
        if (formData.pricePerNight !== undefined) input.pricePerNight = formData.pricePerNight;
        if (formData.typePerson !== undefined) input.typePerson = formData.typePerson;
        if (formData.roomInformation !== undefined) input.roomInformation = formData.roomInformation;
      } else if (section === 'amenities') {
        if (formData.internet !== undefined) input.internet = formData.internet;
        if (formData.foodAndDrink !== undefined) input.foodAndDrink = formData.foodAndDrink;
        if (formData.bedRoom !== undefined) input.bedRoom = formData.bedRoom;
        if (formData.bathroom !== undefined) input.bathroom = formData.bathroom;
        if (formData.accessibility !== undefined) input.accessibility = formData.accessibility;
        if (formData.entertainment !== undefined) input.entertainment = formData.entertainment;
        if (formData.other !== undefined) input.other = formData.other;
      } else if (section === 'images') {
        if (formData.imageURL !== undefined) input.imageURL = formData.imageURL;
      } else if (section === 'details') {
        if (formData.roomInformation !== undefined) input.roomInformation = formData.roomInformation;
      }

      const result = await updateRoom({
        variables: {
          updateRoomId: roomId,
          input,
        },
      });

      if (result.data?.updateRoom === Response.Success) {
        await refetch();
        onOpenChange(false);
      } else {
        setError('Failed to update room. Please try again.');
      }
    } catch (error: any) {
      console.error('Error updating room:', error);
      setError('An error occurred while updating the room. Please try again.');
    }
  };
  const getSectionComponent = () => {
    let component;
    switch (section) {
      case 'basic':
        component = <BasicInfoSection room={formData} handleInputChange={handleInputChange} />;
        break;
      case 'amenities':
        component = <AmenitiesSection room={formData} handleInputChange={handleInputChange} />;
        break;
      case 'images':
        component = <ImagesSection room={formData} handleInputChange={handleInputChange} />;
        break;
      case 'details':
        component = <DetailsSection room={formData} handleInputChange={handleInputChange} />;
        break;
      default:
        component = null;
    }
    return component || null;
  };
  const getSectionTitle = () => {
    const titleMap = {
      basic: 'Basic Information',
      amenities: 'Amenities',
      images: 'Images',
      details: 'Details',
    };
    return titleMap[section] || 'Edit Room';
  };
  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    if (newOpen) {
      setError(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" data-testid="edit-room-modal">
        <DialogHeader>
          <DialogTitle data-testid="edit-room-modal-title">Edit {getSectionTitle()}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          <div className="min-h-[400px]" data-testid="edit-room-modal-content">
            {getSectionComponent()}
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={updateLoading} data-testid="edit-room-modal-cancel">
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700" disabled={updateLoading} data-testid="edit-room-modal-save">
            {updateLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
