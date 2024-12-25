import { PropsWithChildren } from 'react';
import '.././global.css';
import FooterHome from '@/components/FooterHome';

import HotelDetail from '../(client)/_components/HotelDetail';
import Header from '@/components/providers/Header';

const PublicLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Header />
      <HotelDetail />
      {children}
      <FooterHome />
    </>
  );
};

export default PublicLayout;
