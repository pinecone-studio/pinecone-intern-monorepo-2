'use client';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { BasicInfoSection, LocationSection, AmenitiesSection, LanguagesSection, PoliciesSection, FAQSection, DetailsSection, ImagesSection } from './edit-sections';

const UPDATE_HOTEL_MUTATION = gql`
  mutation UpdateHotel($updateHotelId: ID!, $hotel: UpdateHotelInput!) {
    updateHotel(id: $updateHotelId, hotel: $hotel) {
      success
      message
    }
  }
`;

interface EditHotelModalProps {
  hotel: any;
  section: 'basic' | 'location' | 'amenities' | 'policies' | 'languages' | 'faq' | 'images' | 'details';
  isOpen: boolean;
  onOpenChange: (_open: boolean) => void;
  refetch: () => Promise<any>;
  hotelId: string;
}

export const EditHotelModal = ({ hotel, section, isOpen, onOpenChange, refetch, hotelId }: EditHotelModalProps) => {
  const [updateHotel, { loading: updateLoading }] = useMutation(UPDATE_HOTEL_MUTATION);
  const [formData, setFormData] = useState({
    name: hotel.name,
    description: hotel.description,
    phone: hotel.phone,
    city: hotel.city,
    country: hotel.country,
    location: hotel.location,
    stars: hotel.stars,
    rating: hotel.rating,
    amenities: hotel.amenities,
    languages: hotel.languages,
    policies: hotel.policies,
    faq: hotel.faq,
    images: hotel.images,
    optionalExtras: hotel.optionalExtras || [],
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const hasChanged = (field: string) => {
    return JSON.stringify(formData[field as keyof typeof formData]) !== JSON.stringify(hotel[field as keyof typeof hotel]);
  };

  const getUpdateData = () => {
    const updateData: any = {};
    const fields = ['name', 'description', 'phone', 'city', 'country', 'location', 'amenities', 'languages', 'policies', 'faq', 'images', 'optionalExtras'];

    fields.forEach((field) => {
      if (hasChanged(field)) {
        updateData[field] = formData[field as keyof typeof formData];
      }
    });

    return updateData;
  };

  const handleSave = async () => {
    try {
      const updateData = getUpdateData();

      if (Object.keys(updateData).length === 0) {
        onOpenChange(false);
        return;
      }

      const result = await updateHotel({
        variables: {
          updateHotelId: hotelId,
          hotel: updateData,
        },
      });

      if (result.data?.updateHotel?.success) {
        await refetch();
        onOpenChange(false);
      } else {
        console.error('Failed to update hotel:', result.data?.updateHotel?.message || 'Unknown error');
        alert('Failed to update hotel. Please try again.');
      }
    } catch (error) {
      console.error('Error updating hotel:', error);
      alert('Error updating hotel. Please try again.');
    }
  };

  const getSectionComponent = () => {
    const sectionMap = {
      basic: <BasicInfoSection formData={formData} handleInputChange={handleInputChange} />,
      location: <LocationSection formData={formData} handleInputChange={handleInputChange} />,
      amenities: <AmenitiesSection formData={formData} handleInputChange={handleInputChange} />,
      languages: <LanguagesSection formData={formData} handleInputChange={handleInputChange} />,
      policies: <PoliciesSection formData={formData} handleInputChange={handleInputChange} />,
      faq: <FAQSection formData={formData} handleInputChange={handleInputChange} />,
      images: <ImagesSection formData={formData} handleInputChange={handleInputChange} />,
      details: <DetailsSection formData={formData} handleInputChange={handleInputChange} />,
    };

    // This line should be covered by tests with invalid sections
    const component = sectionMap[section as keyof typeof sectionMap];
    // This line should also be covered by tests with invalid sections
    return component || null;
  };

  const getSectionTitle = () => {
    const titleMap = {
      basic: 'Basic Information',
      location: 'Location',
      amenities: 'Amenities',
      languages: 'Languages',
      policies: 'Policies',
      faq: 'FAQ',
      images: 'Images',
      details: 'Details',
    };
    return titleMap[section] || 'Edit Hotel';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" data-testid="edit-hotel-modal">
        <DialogHeader>
          <DialogTitle data-testid="edit-hotel-modal-title">Edit {getSectionTitle()}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="min-h-[400px]" data-testid="edit-hotel-modal-content">
            {getSectionComponent()}
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={updateLoading} data-testid="edit-hotel-modal-cancel">
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700" disabled={updateLoading} data-testid="edit-hotel-modal-save">
            {updateLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
