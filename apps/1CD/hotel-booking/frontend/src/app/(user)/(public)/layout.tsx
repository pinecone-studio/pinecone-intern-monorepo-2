'use client';
import { PropsWithChildren, useState } from 'react';
import '../.././global.css';
import FooterHome from '@/components/FooterHome';
import Header from '@/components/providers/Header';
import { DateRange } from 'react-day-picker';
import { SearchFilter } from '@/components/providers/SearchFilterProvider';

const PublicLayout = ({ children }: PropsWithChildren) => {
  const [date, setDate] = useState<DateRange | undefined>();
  const [roomType, setRoomType] = useState('');
  return (
    <>
      <SearchFilter.Provider value={{ date, setDate, roomType, setRoomType }}>
        <Header />
        {children}
        <FooterHome />
      </SearchFilter.Provider>
    </>
  );
};

export default PublicLayout;
