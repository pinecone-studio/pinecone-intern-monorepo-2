'use client';
import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';
import { ComboboxDemo } from '../../app/TravelerSelection';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/search-hotel/DatePicker';
import { SearchedHotelCards } from '@/components/search-hotel/SearchedHotelCards';
import { useGetHotelsQuery } from '@/generated';
import RatingCheckbox from '@/components/search-hotel/RatingRadio';
import StarRatingCheckbox from '@/components/search-hotel/StarRating';
import { AmenitiesMock, StarRatingMock, UserRatingMock } from 'public/filters-data';
import AmenitiesCheckbox from '@/components/search-hotel/AmenitiesCheckbox';

const Page = () => {
  const { data } = useGetHotelsQuery();
  return (
    <>
      <main data-cy="Get-Rooms-Page" className="h-full">
        <section data-testid="search-result-section" className="flex mx-auto items-center pl-5 gap-4 mt-20 max-w-[1200px] max-h-28 border-[3px] border-orange-200 rounded-xl">
          <div className="flex flex-col gap-2 my-4">
            <p>Dates</p>
            <DatePickerWithRange />
          </div>
          <div className="flex flex-col gap-2 my-4">
            <p>Travels</p>
            <ComboboxDemo />
          </div>
          <Button className="mr-5 bg-blue-700 mt-7" data-testid="search-hotel-room-btn">
            Search
          </Button>
        </section>
        <section className="flex justify-center w-full gap-16">
          <main className="flex flex-col gap-4 w-60">
            <div className="flex flex-col gap-2 mt-12">
              <p>Search by property name</p>
              <Input type="text" placeholder="Search" className="max-w-96" data-testid="search-hotel-by-name-input" />
            </div>
            <div className="flex flex-col gap-3 pt-3 pl-3 border-t-2">
              <h2>Rating</h2>
              {UserRatingMock.map((rating, index) => (
                <RatingCheckbox key={index} rating={rating} />
              ))}
            </div>
            <div className="flex flex-col gap-3 pt-3 pl-3">
              <h2>Stars</h2>
              {StarRatingMock.map((stars, index) => (
                <StarRatingCheckbox key={index} stars={stars} />
              ))}
            </div>
            <div className="flex flex-col gap-3 pt-3 pl-3">
              <h2>Amenities</h2>
              {AmenitiesMock.map((amenities, index) => (
                <AmenitiesCheckbox key={index} amenities={amenities} />
              ))}
            </div>
          </main>
          <section className="h-full pb-20 mt-10">
            <div className="flex items-center justify-between">
              <p>51 properties</p>
              <Select>
                <SelectTrigger data-testid="filter-select" className="w-80">
                  <SelectValue placeholder="Recommended" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Recommended</SelectItem>
                  <SelectItem value="dark">Price: Low to High</SelectItem>
                  <SelectItem value="system">Price: High to Low</SelectItem>
                  <SelectItem value="star">Star Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {data?.getHotels.slice(0, 5).map((hotelData) => (
              <SearchedHotelCards key={hotelData._id} hotelData={hotelData} />
            ))}
          </section>
        </section>
      </main>
    </>
  );
};
export default Page;
