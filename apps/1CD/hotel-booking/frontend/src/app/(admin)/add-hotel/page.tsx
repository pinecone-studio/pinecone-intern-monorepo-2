'use client';

import { Button } from '@mui/material';
import { useState } from 'react';
import AddRoomGeneralInfo from '../AddRoomGeneralInfo';
const Page = () => {
  const [roomOpen, setRoomOpen] = useState(false);

  return (
    <div data-cy="Add-Hotel-Page">
      <div>add hotel page</div>
      <Button data-cy="Add-Room-General-Info-Dialog" onClick={() => setRoomOpen(true)} className="bg-black">
        open dialog
      </Button>

      <AddRoomGeneralInfo setOpen={setRoomOpen} open={roomOpen} />
    </div>
  );
};
export default Page;
