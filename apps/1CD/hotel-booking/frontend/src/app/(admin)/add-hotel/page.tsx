'use client';
import AddRoomGeneralInfo from '@/app/(admin)/AddRoomGeneralInfo';
import AddHotelGeneralInfo from '../AddHotelGeneralInfo';
import { Button } from '@mui/material';
import { useState } from 'react';
const Page = () => {
  const [hotelOpen, setHotelOpen] = useState(false);
  const [roomOpen, setRoomOpen] = useState(false);
  return (
    <div data-cy="Add-Hotel-Page">
      <div>add hotel page</div>
      <Button data-cy="Open-Dialog-Button" onClick={() => setHotelOpen(true)} className="bg-black">
        open dialog
      </Button>
      <div data-cy={`Add-Hotel-General-Info-Dialog`}>
        <AddHotelGeneralInfo setOpen={setHotelOpen} open={hotelOpen} />
      </div>
      <Button data-cy="Add-Room-General-Info-Dialog" onClick={() => setRoomOpen(true)}>
        pen add room dialog
      </Button>
      <AddRoomGeneralInfo open={roomOpen} setOpen={setRoomOpen} />
    </div>
  );
};
export default Page;
