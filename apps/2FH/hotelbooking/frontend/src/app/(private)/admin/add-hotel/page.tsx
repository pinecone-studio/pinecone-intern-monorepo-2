'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateHotelMutation, Amenity } from '@/generated';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { BasicInformation } from '@/components/admin/add-hotel/BasicInformation';
import { LanguagesSection } from '@/components/admin/add-hotel/LanguagesSection';
import { AmenitiesSection } from '@/components/admin/add-hotel/AmenitiesSection';
import { ImageUpload } from '@/components/admin/add-hotel/ImageUpload';
import { PoliciesSection } from '@/components/admin/add-hotel/PoliciesSection';
import { FaqSection } from '@/components/admin/add-hotel/FaqSection';
import { OptionalExtrasSection } from '@/components/admin/add-hotel/OptionalExtrasSection';
import type { FormData, Policy, FaqItem, OptionalExtra } from '@/components/admin/add-hotel/types';

export const dynamic = 'force-dynamic';

const AddHotelPage = () => {
  const router = useRouter();
  const [createHotel, { loading, error }] = useCreateHotelMutation();

  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    stars: 3,
    phone: '',
    rating: 7.0,
    city: '',
    country: '',
    location: '',
    languages: ['English'],
    amenities: [],
    policies: [
      {
        checkIn: '14:00',
        checkOut: '11:00',
        specialCheckInInstructions: 'Please present valid ID and credit card',
        accessMethods: ['Key card', 'Mobile app'],
        childrenAndExtraBeds: 'Children under 12 stay free',
        pets: 'Pets not allowed',
      },
    ],
    optionalExtras: [
      {
        youNeedToKnow: 'Free breakfast included',
        weShouldMention: '24/7 front desk service',
      },
    ],
    faq: [
      {
        question: 'What time is check-in?',
        answer: 'Check-in is available from 2:00 PM',
      },
    ],
  });

  const handleInputChange = (field: keyof FormData, value: string | number | string[] | Amenity[] | Policy[] | FaqItem[] | OptionalExtra[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await createHotel({
        variables: {
          hotel: {
            ...formData,
            images: imageUrls,
            languages: formData.languages.filter((lang) => lang.trim() !== ''),
            faq: formData.faq.filter((item) => item.question.trim() !== '' && item.answer.trim() !== ''),
            optionalExtras: formData.optionalExtras.filter((item) => item.youNeedToKnow.trim() !== '' && item.weShouldMention.trim() !== ''),
          },
        },
      });

      if (result.data?.createHotel.success) {
        alert('Hotel created successfully!');
        router.push('/admin');
      }
    } catch (err) {
      console.error('Error creating hotel:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6" data-cy="add-hotel-page">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button data-cy="back-button" variant="outline" onClick={() => router.back()} className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Back
          </Button>
          <h1 data-cy="page-title" className="text-3xl font-bold text-gray-900">
            Add New Hotel
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8" data-cy="add-hotel-form">
          <BasicInformation formData={formData} onInputChange={handleInputChange} data-cy="basic-information" />

          <ImageUpload uploadedImages={uploadedImages} imageUrls={imageUrls} onImagesChange={setUploadedImages} onUrlsChange={setImageUrls} data-cy="image-upload" />

          <LanguagesSection languages={formData.languages} onLanguagesChange={(languages) => handleInputChange('languages', languages)} data-cy="languages-section" />

          <AmenitiesSection amenities={formData.amenities} onAmenitiesChange={(amenities) => handleInputChange('amenities', amenities)} data-cy="amenities-section" />

          <PoliciesSection policies={formData.policies} onPoliciesChange={(policies) => handleInputChange('policies', policies)} data-cy="policies-section" />

          <FaqSection faq={formData.faq} onFaqChange={(faq) => handleInputChange('faq', faq)} data-cy="faq-section" />

          <OptionalExtrasSection
            optionalExtras={formData.optionalExtras}
            onOptionalExtrasChange={(optionalExtras) => handleInputChange('optionalExtras', optionalExtras)}
            data-cy="optional-extras-section"
          />

          {error && (
            <div data-cy="error-message" className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              Error: {error.message}
            </div>
          )}

          <div className="flex gap-4 pt-6">
            <Button data-cy="create-hotel-button" type="submit" disabled={loading} className="flex-1">
              {loading ? 'Creating Hotel...' : 'Create Hotel'}
            </Button>
            <Button data-cy="cancel-button" type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHotelPage;
