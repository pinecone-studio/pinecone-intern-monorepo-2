'use client';
import { Input } from '@/components/ui/input';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchedHotelCards } from '@/components/search-hotel/SearchedHotelCards';
import { useGetFilterByPropertiesHotelsLazyQuery } from '@/generated';
import RatingCheckbox from '@/components/search-hotel/RatingRadio';
import StarRatingCheckbox from '@/components/search-hotel/StarRating';
import { AmenitiesMock, StarRatingMock, UserRatingMock } from 'public/filters-data';
import AmenitiesCheckbox from '@/components/search-hotel/AmenitiesCheckbox';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useQueryState } from 'nuqs';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const Page = () => {
  // eslint-disable-next-line no-unused-vars
  const router = useRouter();
  const [roomType] = useQueryState('roomType');
  const [dateFrom] = useQueryState('dateFrom', {
    defaultValue: '',
  });
  const [dateTo] = useQueryState('dateTo', {
    defaultValue: '',
  });
  const [price, setPrice] = useState(0);

  const [userReviewRating, setUserReviewRating] = useState<number>(0);
  const [starRating, setStarRating] = useState<number>(0);
  const [hotelAmenities, setHotelAmenities] = useState<string[]>([]);
  const [hotelName, setHotelName] = useState('');
  const handlePriceSort = useCallback(
    (value: string) => {
      setPrice(Number(value));
    },
    [price]
  );

  const [getFilteredHotels, { loading, data }] = useGetFilterByPropertiesHotelsLazyQuery({
    variables: {
      input: {
        checkInDate: dateFrom,
        checkOutDate: dateTo,
        starRating: starRating,
        userRating: userReviewRating,
        hotelAmenities: hotelAmenities,
        price: price,
        roomType: roomType,
        hotelName: hotelName,
      },
    },
  });
  useEffect(() => {
    getFilteredHotels();
  }, [getFilteredHotels, starRating, userReviewRating, hotelAmenities, hotelName, price, dateFrom, dateTo]);
  const handlePropertyName = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setHotelName(e.target.value);
    },
    [hotelName]
  );

  return (
    <main data-cy="Get-Rooms-Page" className="h-full px-4">
      <section className="flex flex-col items-center w-full gap-16 pb-20 md:items-start md:justify-center md:flex-row">
        <main className="flex flex-col items-center w-full gap-4 md:p-0 md:w-60 md:mt-12">
          <div className="flex flex-col w-full gap-2">
            <p>Search by property name</p>
            <Input data-cy="Search-By-Property-Name" value={hotelName} onChange={handlePropertyName} type="text" placeholder="Search" className="max-w-96" data-testid="search-hotel-by-name-input" />
          </div>
          <div className="flex flex-col w-full gap-3 pt-3 pl-3 border-t-2">
            <h2>Rating</h2>
            <div className="flex flex-row-reverse justify-end gap-3 md:flex-col">
              {UserRatingMock.map((rating, index) => (
                <RatingCheckbox index={index} userReviewRating={userReviewRating} setUserReviewRating={setUserReviewRating} key={index} rating={rating} />
              ))}
            </div>
          </div>
          <div className="flex flex-col w-full gap-3 pt-3 pl-3">
            <h2>Stars</h2>
            <div className="flex flex-row-reverse justify-end gap-3 whitespace-nowrap md:flex-col">
              {StarRatingMock.map((stars, index) => (
                <StarRatingCheckbox index={index} starRating={starRating} setStarRating={setStarRating} key={index} stars={stars} />
              ))}
            </div>
          </div>
          <div className="flex flex-col w-full gap-3 pt-3 pl-3">
            <h2>Amenities</h2>
            <div className="flex flex-row-reverse justify-end gap-3 md:flex-col">
              {AmenitiesMock.map((amenities, index) => (
                <AmenitiesCheckbox index={index} key={index} setHotelAmenities={setHotelAmenities} hotelAmenities={hotelAmenities} amenities={amenities} />
              ))}
            </div>
          </div>
        </main>
        <section className="max-w-[872px] w-full h-full  mt-10">
          <div className="flex flex-col md:items-center md:justify-between md:flex-row">
            <p>{data?.getFilterByPropertiesHotels.length} properties</p>
            <Select onValueChange={handlePriceSort}>
              <SelectTrigger data-cy="Sort-By-Price" data-testid="filter-select" className="w-80">
                <SelectValue placeholder="Recommended" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Recommended</SelectItem>
                <SelectItem value="1">Price: Low to High</SelectItem>
                <SelectItem value="-1">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {loading ? (
            <div className="flex items-center justify-center w-full min-h-screen">
              <div className="flex items-center justify-center gap-2 text-3xl font-bold">
                <div className="flex justify-center">
                  <Image src={'/loader.svg'} alt="loader" width={200} height={200} className="w-[200px] h-[200px]" />
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full max-h-screen overflow-scroll">
              {data?.getFilterByPropertiesHotels.map((hotelData) => (
                <div key={hotelData._id} onClick={() => router.push(`/hotel-detail/${hotelData._id}?dateTo=${dateTo}&dateFrom=${dateFrom}`)}>
                  <SearchedHotelCards hotelData={hotelData} />
                </div>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
};
export default Page;
