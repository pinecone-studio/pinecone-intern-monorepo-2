'use client';
import { Input } from '@/components/ui/input';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchedHotelCards } from '@/components/search-hotel/SearchedHotelCards';
import { useGetRoomsLazyQuery } from '@/generated';
import RatingCheckbox from '@/components/search-hotel/RatingRadio';
import StarRatingCheckbox from '@/components/search-hotel/StarRating';
import { AmenitiesMock, StarRatingMock, UserRatingMock } from 'public/filters-data';
import AmenitiesCheckbox from '@/components/search-hotel/AmenitiesCheckbox';
import { Loader2 } from 'lucide-react';
import React, { ChangeEvent, useCallback, useContext, useEffect, useState } from 'react';
import { Context } from '../layout';
import Link from 'next/link';

const Page = () => {
  // eslint-disable-next-line no-unused-vars
  const value = useContext(Context);
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

  const [getRooms, { loading, data }] = useGetRoomsLazyQuery({
    variables: {
      input: {
        checkInDate: value?.date?.from,
        checkOutDate: value?.date?.to,
        starRating: starRating,
        userRating: userReviewRating,
        hotelAmenities: hotelAmenities,
        price: price,
        roomType: value?.roomType,
        hotelName: hotelName,
      },
    },
  });
  useEffect(() => {
    getRooms();
  }, [value?.date, getRooms, starRating, userReviewRating, hotelAmenities, hotelName, price, value?.roomType]);
  const handlePropertyName = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setHotelName(e.target.value);
    },
    [hotelName]
  );

  return (
    <>
      <main data-cy="Get-Rooms-Page" className="h-full">
        <section className="flex justify-center w-full gap-16 pb-20">
          <main className="flex flex-col gap-4 w-60">
            <div className="flex flex-col gap-2 mt-12">
              <p>Search by property name</p>
              <Input data-cy="Search-By-Property-Name" value={hotelName} onChange={handlePropertyName} type="text" placeholder="Search" className="max-w-96" data-testid="search-hotel-by-name-input" />
            </div>
            <div className="flex flex-col gap-3 pt-3 pl-3 border-t-2">
              <h2>Rating</h2>
              {UserRatingMock.map((rating, index) => (
                <RatingCheckbox index={index} userReviewRating={userReviewRating} setUserReviewRating={setUserReviewRating} key={index} rating={rating} />
              ))}
            </div>
            <div className="flex flex-col gap-3 pt-3 pl-3">
              <h2>Stars</h2>
              {StarRatingMock.map((stars, index) => (
                <StarRatingCheckbox index={index} starRating={starRating} setStarRating={setStarRating} key={index} stars={stars} />
              ))}
            </div>
            <div className="flex flex-col gap-3 pt-3 pl-3">
              <h2>Amenities</h2>
              {AmenitiesMock.map((amenities, index) => (
                <AmenitiesCheckbox index={index} key={index} setHotelAmenities={setHotelAmenities} hotelAmenities={hotelAmenities} amenities={amenities} />
              ))}
            </div>
          </main>
          <section className="max-w-[872px] w-full h-full  mt-10">
            <div className="flex items-center justify-between">
              <p>{data?.getRooms.length} properties</p>
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
                  <Loader2 className="animate-spin" />
                  <div>Loading...</div>
                </div>
              </div>
            ) : (
              <div className="h-full max-h-screen overflow-scroll">
                {data?.getRooms.map((roomData) => (
                  <Link key={roomData.id} href={`/hotel-detail/${roomData.hotelId?._id}`}>
                    <SearchedHotelCards roomData={roomData} />
                  </Link>
                ))}
              </div>
            )}
          </section>
        </section>
      </main>
    </>
  );
};
export default Page;
