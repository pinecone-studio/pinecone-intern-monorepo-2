import { Dialog, DialogContent } from '@/components/providers/HotelBookingDialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Hotel, useUpdateHotelLocationMutation } from '@/generated';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const UpdateHotelLocation = ({
  open,
  hotel,
  setOpen,
  AllQueriesRefetch,
  hotelId,
}: {
  open: boolean;
  setOpen: (_value: boolean) => void;
  hotelId: string;
  hotel: Hotel;
  AllQueriesRefetch: () => void;
}) => {
  const [updateLocation] = useUpdateHotelLocationMutation({
    onCompleted: () => AllQueriesRefetch(),
  });
  const [locationValue, setLocationValue] = useState('');
  const updateHotelLocation = async () => {
    await updateLocation({
      variables: {
        id: hotelId,
        location: locationValue,
      },
    });
    toast('successfully updated your location', {
      style: {
        border: 'green solid 1px',
        color: 'green',
      },
    });
    setOpen(false);
  };
  useEffect(() => {
    if (hotel.location) {
      setLocationValue(hotel.location);
    }
  }, []);
  return (
    <Dialog data-cy="Location-Dialog" open={open}>
      <DialogContent>
        <div className="text-[#09090B] text-foreground">Location</div>
        <Textarea value={locationValue} onChange={(e) => setLocationValue(e.target.value)} />
        <div className="flex justify-between">
          <Button onClick={() => setOpen(false)} className="text-black bg-white border hover:bg-slate-100 active:bg-slate-200">
            Cancel
          </Button>
          <Button onClick={updateHotelLocation} className="bg-[#2563EB] hover:bg-blue-500 active:bg-blue-600">
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default UpdateHotelLocation;
