'use client';

import { RoomType, User } from '@/generated';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useQueryState } from 'nuqs';
import { toast } from 'sonner';

import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useAuth } from '@/components/providers';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/providers/HotelBookingDialog';
import DisplayTugrug from '@/components/DisplayTugrug';

const PriceDetail = ({ room, handleOpen, isOn }: { room: RoomType; isOn: boolean; handleOpen: () => void }) => {
  const router = useRouter();
  const { user } = useAuth();
  const [dateTo] = useQueryState('dateTo');
  const [dateFrom] = useQueryState('dateFrom');

  return (
    <Dialog open={isOn}>
      <DialogContent className="max-w-screen-sm p-6" data-cy="Price-Detail-Dialog">
        <DialogHeader>
          <DialogTitle className="flex justify-between">
            <div className="text-xl font-semibold">Price Detail</div>
            <button data-cy="Price-Detail-Dialog-Close" className="outline-none" onClick={handleOpen}>
              <X className="w-4 h-4" />
            </button>
          </DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-normal">2 night</p>
            <DisplayTugrug tugrug={room.price ? Number(room.price) : undefined} /> per night
          </div>
          <div className="text-sm font-medium">
            <DisplayTugrug tugrug={room.price ? Number(room.price) : undefined} />
          </div>
        </div>
        <div className="w-full border border-solid 1px bg-[#E4E4E7]"></div>
        {totalPrice(dateFrom, dateTo, Number(room.price)) && (
          <div className="flex justify-between">
            <div className="text-sm font-medium">Total price</div>
            <div className="text-lg font-semibold">
              <DisplayTugrug tugrug={totalPrice(dateFrom, dateTo, Number(room.price))} />
            </div>
          </div>
        )}
        <Button
          onClick={() => handleReserve(user, router, dateTo, dateFrom, String(room._id))}
          data-cy="Reserve-button"
          className="flex justify-center text-sm font-medium text-white bg-blue-700 hover:bg-blue-500"
        >
          Reserve
        </Button>
      </DialogContent>
    </Dialog>
  );
};
export default PriceDetail;

export const totalPrice = (dateFrom: string | null, dateTo: string | null, roomPrice: number | null) => {
  if (dateFrom && dateTo && roomPrice) {
    const date2 = new Date(dateTo);
    const date1 = new Date(dateFrom);
    let diff = Math.abs(date2.getTime() - date1.getTime());
    diff = diff / (1000 * 60 * 60 * 24);
    return diff * roomPrice;
  }
};
export const handleReserve = (user: User | null | undefined, router: AppRouterInstance, dateTo: string | null, dateFrom: string | null, id: string) => {
  if (!user) {
    toast('please first login', {
      style: {
        color: 'red',
        borderColor: 'red',
      },
    });
    router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}&dateTo=${dateTo}&dateFrom=${dateFrom}`);
    return;
  }
  if (dateTo && dateFrom) {
    router.push(`/checkout/${id}?dateTo=${dateTo}&dateFrom=${dateFrom}`);
    return;
  }
  toast('you must enter checkin date and checkout date', {
    style: {
      color: 'red',
      borderColor: 'red',
    },
  });
};
