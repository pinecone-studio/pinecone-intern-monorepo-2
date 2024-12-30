'use client';
import { createContext, Dispatch, PropsWithChildren, SetStateAction, useState } from 'react';
import '../.././global.css';
import FooterHome from '@/components/FooterHome';
import Header from '@/components/providers/Header';
import { DateRange } from 'react-day-picker';
type DateRangeContextType = {
  date: DateRange | undefined;
  setDate: Dispatch<SetStateAction<DateRange | undefined>>;
  roomType: string;
  setRoomType: Dispatch<SetStateAction<string>>;
} | null;
export const Context = createContext<DateRangeContextType>(null);
const PublicLayout = ({ children }: PropsWithChildren) => {
  const [date, setDate] = useState<DateRange | undefined>();
  const [roomType, setRoomType] = useState('');
  return (
    <>
      <Context.Provider value={{ date, setDate, roomType, setRoomType }}>
        <Header />
        {children}
        <FooterHome />
      </Context.Provider>
    </>
  );
};

export default PublicLayout;
