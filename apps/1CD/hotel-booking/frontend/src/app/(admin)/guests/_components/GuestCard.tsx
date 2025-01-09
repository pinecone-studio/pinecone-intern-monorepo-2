import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { ReturnBooking } from '@/generated';
import { format } from 'date-fns';
import BookingStatusBadge from '@/components/BookingStatusBadge';

const GuestCard = ({ info, setOpen }: { info: ReturnBooking | undefined | null; setOpen: (_value: boolean) => void }) => {
  const openDialog = () => {
    setOpen(true);
  };
  return (
    <>
      <section className="flex justify-center gap-4">
        <Card className="xl:min-w-[700px] xl:max-h-[500px]">
          <CardHeader className="border-b-[1px]">Guest Info</CardHeader>
          <CardContent className="flex flex-col">
            <section className="flex justify-between pt-5">
              <div className="flex flex-col flex-1 gap-6">
                <ul>
                  <li className="font-light text-gray-500">Firstname</li>
                  <li>{info?.firstName}</li>
                </ul>
                <ul className="flex flex-col gap-1">
                  <li className="font-light text-gray-500">Status</li>
                  <BookingStatusBadge status={info?.status} />
                </ul>
                <ul>
                  <li className="font-light text-gray-500">Check in</li>
                  {info?.checkInDate && (
                    <div className="flex gap-1">
                      <div>{format(info?.checkInDate, 'EEEE, MMM d,')}</div>
                      <div>{format(info?.checkInDate, 'h:mma')}</div>
                    </div>
                  )}
                </ul>
              </div>
              <div className="flex flex-col flex-1 gap-6">
                <ul>
                  <li className="font-light text-gray-500">Last name</li>
                  <li>{info?.lastName}</li>
                </ul>
                <ul>
                  <li className="font-light text-gray-500">Guests</li>
                  <li>1 adult, 0 children</li>
                </ul>
                <ul>
                  <li className="font-light text-gray-500">Check out</li>
                  {info?.checkInDate && (
                    <div className="flex gap-1">
                      <div>{format(info?.checkOutDate, 'EEEE, MMM d,')}</div>
                      <div>{format(info?.checkOutDate, 'h:mma')}</div>
                    </div>
                  )}
                </ul>
              </div>
            </section>
            <section className="flex justify-between border-t-[1px] mt-5 pt-5">
              <div className="flex flex-col flex-1 gap-5">
                <ul>
                  <li className="font-light text-gray-500">Email</li>
                  <li>{info?.email}</li>
                </ul>
                <ul>
                  <li className="font-light text-gray-500">Guest Request</li>
                  <li>No request</li>
                </ul>
              </div>
              <div className="flex flex-col flex-1 gap-5">
                <ul>
                  <li className="font-light text-gray-500">Phone number</li>
                  <li>{info?.phoneNumber}</li>
                </ul>
                <div className="flex justify-between">
                  <ul>
                    <li className="font-light text-gray-500">Room number</li>
                    <li>{info?.roomId?.roomType}</li>
                  </ul>
                  <Button data-cy="Checkout-Button" onClick={openDialog} className={`bg-blue-600 mt-9 ${info?.status == 'booked' ? 'block' : 'hidden'}`}>
                    Checkout
                  </Button>
                </div>
              </div>
            </section>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default GuestCard;
