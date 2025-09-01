'use client';

import { Data } from '@/app/(private)/booking/[userid]/payment/page';
import { responsePathAsArray } from 'graphql';
import ResponseCache from 'next/dist/server/response-cache';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
type Props = {
  bookingData: Data | undefined | null;
};

export const ConfirmedBooking = ({ bookingData }: Props) => {
  console.log(bookingData?.bookingId);

  return <div data-testid="Confirmed-Booking-Container">Booking Confirmed </div>;
};
