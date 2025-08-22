'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { useHotelsQueryQuery } from 'src/generated';
import { Footer } from '@/components/providers/Footer';
import { HeaderHome } from '@/components/HeaderHome';
import { SearchHome } from '@/components/SearchHome';
import { MostBooked } from '@/components/providers/MostBooked';
import { PopularHotels } from '@/components/providers/checkout/_components/PopularHotels';
import { processHotelData, convertApolloError } from '@/utils/hotelUtils';

const HotelBookingApp = () => {
  const { data, loading, error: apolloError } = useHotelsQueryQuery();

  const allHotels = useMemo(() => {
    if (data?.hotels) {
      return processHotelData(data.hotels);
    }
    return [];
  }, [data]);

  const popularHotels = useMemo(() => {
    return allHotels.filter((hotel) => hotel.isPopular);
  }, [allHotels]);

  const mostBookedHotels = useMemo(() => {
    return allHotels.slice().sort((a, b) => (b.bookingCount || 0) - (a.bookingCount || 0));
  }, [allHotels]);

  const error = useMemo(() => convertApolloError(apolloError), [apolloError]);

  const handleSearch = (searchParams: any) => {
    console.log('Searching with:', searchParams);
    // call Apollo's `refetch` with new variables
    // e.g., refetch({ location: searchParams.location, ... })
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderHome />
      <SearchHome onSearch={handleSearch} initialLocation="Ulaanbaatar" />

      <PopularHotels hotels={popularHotels} loading={loading} error={error} />
      <MostBooked hotels={mostBookedHotels} loading={loading} error={error} />

      <Footer />
    </div>
  );
};

export default HotelBookingApp;
