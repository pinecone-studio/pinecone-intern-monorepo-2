'use client';
import AddHotelGeneralInfo from '@/components/AddHotelGeneralInfo';
import { Button } from '@mui/material';
import { useState } from 'react';
const Page = () => {
  const [open, setOpen] = useState(false);

  return (
    <div data-cy="Add-Hotel-Page">
      <div>add hotel page</div>
      <Button data-cy="Open-Dialog-Button" onClick={() => setOpen(true)} className="bg-black">
        open dialog
      </Button>
      <div data-cy={`Add-Hotel-General-Info-Dialog`}>
        <AddHotelGeneralInfo setOpen={setOpen} open={open} />
      </div>
    </div>
  );
};
export default Page;
