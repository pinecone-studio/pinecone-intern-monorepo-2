'use client';
import { createContext, Dispatch, SetStateAction } from 'react';
import { DateRange } from 'react-day-picker';

export type DateRangeContextType = {
  date: DateRange | undefined;
  setDate: Dispatch<SetStateAction<DateRange | undefined>>;
  roomType: string;
  setRoomType: Dispatch<SetStateAction<string>>;
};

export const SearchFilter = createContext<DateRangeContextType | null>(null);
