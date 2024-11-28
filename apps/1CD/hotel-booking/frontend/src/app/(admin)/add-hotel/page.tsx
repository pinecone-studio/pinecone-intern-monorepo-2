'use client';
import AddHotelGeneralInfo from '@/components/providers/AddHotelGeneralInfo';
import { Button } from '@mui/material';
import { useState } from 'react';
const Page = () => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div>add hotel page</div>
      <Button onClick={() => setOpen(true)} className="bg-black">
        open dialog
      </Button>
      <AddHotelGeneralInfo setOpen={setOpen} open={open} />
    </div>
  );
};
export default Page;
