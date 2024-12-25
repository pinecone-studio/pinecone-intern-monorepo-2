import React from 'react';
import CreateEventModal from './_components/EvenModal';


const homePage = () => {
  return (
    <div className="max-w-[1600px] mx-auto bg-slate-100 h-screen">
      <h1>Admin home Page</h1>
      <div className="h-full">
        <CreateEventModal />
      </div>
    </div>
  );
};

export default homePage;
