'use client';

import { MenubarDemo } from './_components/MenuBar';


const admin = () => {
  return (
    <div>
        <MenubarDemo/>
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold mb-4">Admin Page</h1>
        <p className="text-lg">This is the admin page.</p>
      </div>
    </div>
  );
};

export default admin;
