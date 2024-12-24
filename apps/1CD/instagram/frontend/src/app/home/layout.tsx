import { PropsWithChildren } from 'react';
import { Header } from '@/app/(main)/_components/Header';

const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="relative flex justify-between w-screen pr-1">
      <Header />
      <div className="flex w-full h-screen overflow-scroll">{children}</div>
    </div>
  );
};

export default RootLayout;
