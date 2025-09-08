'use client';

import { useState } from 'react';
import { SearchDash, SearchHotel } from '@/components';

const SearchPage = () => {
  const [search, setSearch] = useState('');
  const [amenities, setAmenities] = useState<string>('');
  const [selectedStars, setSelectedStars] = useState<string>('');
  const [selectedRating, setSelectedRating] = useState<string>('');

  console.log('search name shuu:', search);

  return (
    <div className="py-8 px-15 flex gap-x-12  w-[1160px] mx-auto ">
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
  );
};

export default SearchPage;
