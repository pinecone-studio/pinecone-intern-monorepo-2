import { PropsWithChildren } from 'react';
import './global.css';
import { ApolloWrapper, AuthProvider } from '@/components/providers';
import FooterHome from '@/components/FooterHome';
import Header from '@/components/Header';
import HotelDetail from './(client)/hotel-detail/HotelDetail';
import { ToastContainer } from 'react-toastify';

const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <html lang="en">
      <body>
        <ApolloWrapper>
          <AuthProvider>
            <Header />
            <HotelDetail />
            {children}
            <FooterHome />
            <ToastContainer />
          </AuthProvider>
        </ApolloWrapper>
      </body>
    </html>
  );
};

export default RootLayout;
