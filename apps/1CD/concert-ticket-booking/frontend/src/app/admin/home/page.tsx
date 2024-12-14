import React from 'react';
import CreateEventModal from './EvenModal';

const homePage = () => {
  return (
    <div className="h-full">
      <h1>Admin home Page</h1>
      <div className="h-full">
        <CreateEventModal />
      </div>
    </div>
  );
};

export default homePage;
