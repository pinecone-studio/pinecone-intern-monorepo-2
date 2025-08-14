import React from 'react';
import { Flame } from 'lucide-react';

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <div>
      <div className="flex fixed left-1/2 -translate-x-1/2 top-20 ">
        <Flame className="text-red-500 size-12" />
        <span className="text-5xl font-semibold tracking-tight text-neutral-600 leading-none">tinder</span>
      </div>
      {children}

      <p className="absolute left-1/2 -translate-x-1/2 bottom-10 text-gray-500">©2024 Tinder</p>
    </div>
  );
};

export default Layout;
