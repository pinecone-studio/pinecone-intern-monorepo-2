'use client';

import { useState } from 'react';
import { SearchDash, SearchHotel } from '@/components';
import { DatePicker } from '@/components/date/Date';

const SearchPage = () => {
  const [search, setSearch] = useState('');
  const [amenities, setAmenities] = useState<string>('');
  const [selectedStars, setSelectedStars] = useState<string>('');
  const [selectedRating, setSelectedRating] = useState<string>('');

  console.log('search name shuu:', search);

  return (
    <div className="min-h-screen">
      <div className="bg-[#013B94] pt-10 pb-10 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-6">Find Your Perfect Hotel</h1>
          <div className="flex justify-center">
            <DatePicker />
          </div>
        </div>
      </div>

      <div className="py-8 px-15 flex gap-x-12 w-[1160px] mx-auto">
        <SearchDash
          search={search}
          setSearch={setSearch}
          selectedStars={selectedStars}
          setSelectedStars={setSelectedStars}
          selectedRating={selectedRating}
          setSelectedRating={setSelectedRating}
          amenities={amenities}
          setAmenities={setAmenities}
        />
        <SearchHotel search={search} selectedStars={selectedStars} selectedRating={selectedRating} amenities={amenities} />
      </div>
    </div>
  );
};

export default SearchPage;
