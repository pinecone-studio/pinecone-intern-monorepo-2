import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookingsType } from '@/generated';

const GuestCard = ({ info }: { info: BookingsType }) => {
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
                  <li>{info?.userId?.firstName}</li>
                </ul>
                <ul>
                  <li className="font-light text-gray-500">Status</li>
                  <Badge>booked</Badge>
                </ul>
                <ul>
                  <li className="font-light text-gray-500">Check in</li>
                  <li>{new Date(info?.checkInDate).toLocaleDateString('es-Us', { month: 'short', day: 'numeric' })}</li>
                </ul>
              </div>
              <div className="flex flex-col flex-1 gap-6">
                <ul>
                  <li className="font-light text-gray-500">Last name</li>
                  <li>Nymdorj</li>
                </ul>
                <ul>
                  <li className="font-light text-gray-500">Guests</li>
                  <li>1 adult, 0 children</li>
                </ul>
                <ul>
                  <li className="font-light text-gray-500">Check out</li>
                  <li>1 adult, 0 children</li>
                </ul>
              </div>
            </section>
            <section className="flex justify-between border-t-[1px] mt-5 pt-5">
              <div className="flex flex-col flex-1 gap-5">
                <ul>
                  <li className="font-light text-gray-500">Email</li>
                  <li>@gmail.com</li>
                </ul>
                <ul>
                  <li className="font-light text-gray-500">Guest Request</li>
                  <li>@gmail.com</li>
                </ul>
              </div>
              <div className="flex flex-col flex-1 gap-5">
                <ul>
                  <li className="font-light text-gray-500">Phone number</li>
                  <li>@gmail.com</li>
                </ul>
                <div className="flex justify-between">
                  <ul>
                    <li className="font-light text-gray-500">Room number</li>
                    <li>room</li>
                  </ul>
                  <Button className="bg-blue-600 mt-9">Checkout</Button>
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
