'use client';
import AddHotelGeneralInfo from '../AddHotelGeneralInfo';
import { Button } from '@mui/material';
import { useState } from 'react';
const Page = () => {
  const [hotelOpen, setHotelOpen] = useState(false);
  return (
    <div data-cy="Add-Hotel-Page">
      <div>add hotel page</div>
      <Button data-cy="Open-Dialog-Button" onClick={() => setHotelOpen(true)} className="bg-black">
        open dialog
      </Button>
      <div data-cy={`Add-Hotel-General-Info-Dialog`}>
        <AddHotelGeneralInfo setOpen={setHotelOpen} open={hotelOpen} />
      </div>
    </div>
  );
};
export default Page;
