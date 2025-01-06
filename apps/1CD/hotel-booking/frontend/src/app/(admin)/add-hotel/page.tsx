'use client';
import AddRoomGeneralInfo from '@/app/(admin)/AddRoomGeneralInfo';

import { Button } from '@mui/material';
import { useState } from 'react';
const Page = () => {
  const [roomOpen, setRoomOpen] = useState(false);
  return (
    <div data-cy="Add-Hotel-Page">
      <div>add hotel page</div>

      <Button data-cy="Add-Room-General-Info-Dialog" onClick={() => setRoomOpen(true)}>
        pen add room dialog
      </Button>
      <AddRoomGeneralInfo open={roomOpen} setOpen={setRoomOpen} />
    </div>
  );
};
export default Page;
