import { PropsWithChildren } from 'react';
import { Header } from './_components/Header';
import { ToastContainer } from 'react-toastify';
import './global.css';
import 'react-toastify/dist/ReactToastify.css';
import { ConfirmationProvider } from './_components/ConfirmationProvider';
import { RefreshProvider } from './_components/RefreshProvider';

export const metadata = {
  title: 'Secret Manager',
  description: 'Manage your secrets',
};

const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <html lang="en">
      <body className="dark">
        <RefreshProvider>
          <ConfirmationProvider>
            <div className="max-w-4xl px-6 py-10 m-auto">
              <div className="flex flex-col gap-6">
                <Header />
                {children}
                <ToastContainer />
              </div>
            </div>
          </ConfirmationProvider>
        </RefreshProvider>
      </body>
    </html>
  );
};

export default RootLayout;
