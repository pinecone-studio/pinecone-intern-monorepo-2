'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useHotelQuery } from '@/generated';
import { Button } from '@/components/ui/Button';
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
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  if (!data?.hotel) {
    return <NotFoundMessage />;
  }

  const hotel = data.hotel;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={() => router.back()} className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{hotel.name}</h1>
            <div className="flex items-center gap-2 text-gray-600">
              <span>
                {hotel.city}, {hotel.country}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Side - Information Sections */}
          <div className="space-y-6">
            <HotelInfoCard 
              hotel={hotel} 
              editModalState={editModalState} 
              setEditModalState={setEditModalState} 
              refetch={refetch} 
              hotelId={hotelId} 
            />
            
            <HotelDetailsCard 
              hotel={hotel} 
              editModalState={editModalState} 
              setEditModalState={setEditModalState} 
              refetch={refetch} 
              hotelId={hotelId} 
            />
            
            <AmenitiesCard 
              hotel={hotel} 
              editModalState={editModalState} 
              setEditModalState={setEditModalState} 
              refetch={refetch} 
              hotelId={hotelId} 
            />
            
            <PoliciesCard 
              hotel={hotel} 
              editModalState={editModalState} 
              setEditModalState={setEditModalState} 
              refetch={refetch} 
              hotelId={hotelId} 
            />
            
            <FAQCard 
              hotel={hotel} 
              editModalState={editModalState} 
              setEditModalState={setEditModalState} 
              refetch={refetch} 
              hotelId={hotelId} 
            />
          </div>

          {/* Right Side - Images */}
          <div className="space-y-6">
            <LocationCard 
              hotel={hotel} 
              editModalState={editModalState} 
              setEditModalState={setEditModalState} 
              refetch={refetch} 
              hotelId={hotelId} 
            />
            
            <HotelImagesCard 
              hotel={hotel} 
              editModalState={editModalState} 
              setEditModalState={setEditModalState} 
              refetch={refetch} 
              hotelId={hotelId} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetailPage;
