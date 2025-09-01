'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useHotelQuery } from '@/generated';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { HotelInfoCard, HotelDetailsCard, AmenitiesCard, PoliciesCard, FAQCard, LocationCard, HotelImagesCard, LoadingSkeleton, ErrorMessage, NotFoundMessage } from '@/components/admin/hotel-detail';

const HotelDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const hotelId = params.id as string;

  const [editModalState, setEditModalState] = useState<{
    isOpen: boolean;
    section: 'basic' | 'location' | 'amenities' | 'policies' | 'languages' | 'faq' | 'images' | 'details';
  }>({
    isOpen: false,
    section: 'basic',
  });

  const { data, loading, error, refetch } = useHotelQuery({
    variables: { hotelId: hotelId },
  });

  if (loading) {
    return <LoadingSkeleton data-cy="HotelDetail-Loading" />;
  }

  if (error) {
    return <ErrorMessage data-cy="HotelDetail-Error" message={error.message} />;
  }

  if (!data?.hotel) {
    return <NotFoundMessage data-cy="HotelDetail-NotFound" />;
  }

  const hotel = data.hotel;

  return (
    <div className="min-h-screen bg-gray-50 p-6" data-cy="HotelDetail-Page">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8" data-cy="HotelDetail-Header">
          <Button variant="outline" onClick={() => router.back()} className="flex items-center gap-2" data-cy="HotelDetail-BackButton">
            <ArrowLeft size={16} />
            Back
          </Button>
          <div data-cy="HotelDetail-Title">
            <h1 className="text-3xl font-bold text-gray-900">{hotel.name}</h1>
            <div className="flex items-center gap-2 text-gray-600" data-cy="HotelDetail-Location">
              <span>
                {hotel.city}, {hotel.country}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Side - Information Sections */}
          <div className="space-y-6">
            <HotelInfoCard data-cy="HotelInfoCard" hotel={hotel} editModalState={editModalState} setEditModalState={setEditModalState} refetch={refetch} hotelId={hotelId} />
            <HotelDetailsCard data-cy="HotelDetailsCard" hotel={hotel} editModalState={editModalState} setEditModalState={setEditModalState} refetch={refetch} hotelId={hotelId} />
            <AmenitiesCard data-cy="AmenitiesCard" hotel={hotel} editModalState={editModalState} setEditModalState={setEditModalState} refetch={refetch} hotelId={hotelId} />
            <PoliciesCard data-cy="PoliciesCard" hotel={hotel} editModalState={editModalState} setEditModalState={setEditModalState} refetch={refetch} hotelId={hotelId} />
            <FAQCard data-cy="FAQCard" hotel={hotel} editModalState={editModalState} setEditModalState={setEditModalState} refetch={refetch} hotelId={hotelId} />
          </div>

          {/* Right Side - Images */}
          <div className="space-y-6">
            <LocationCard data-cy="LocationCard" hotel={hotel} editModalState={editModalState} setEditModalState={setEditModalState} refetch={refetch} hotelId={hotelId} />
            <HotelImagesCard data-cy="HotelImagesCard" hotel={hotel} editModalState={editModalState} setEditModalState={setEditModalState} refetch={refetch} hotelId={hotelId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetailPage;
