import { PropsWithChildren } from 'react';
import { Header } from '@/components/header/Header';

const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="relative flex justify-between w-screen gap-10 pr-1">
      <Header />
      <div className="flex w-full h-screen overflow-scroll">{children}</div>
    </div>
  );
};

export default RootLayout;
