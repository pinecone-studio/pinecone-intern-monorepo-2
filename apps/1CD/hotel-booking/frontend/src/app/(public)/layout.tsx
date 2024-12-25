import { PropsWithChildren } from 'react';
import '.././global.css';
import FooterHome from '@/components/FooterHome';
import Header from '@/components/Header';


const PublicLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Header />
      {children}
      <FooterHome />
    </>
  );
};

export default PublicLayout;
