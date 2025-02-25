import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from '@/components/ui/card';
import Image from 'next/image';
import { ReturnBooking } from '@/generated';

const RoomInfo = ({ data }: { data: ReturnBooking | undefined | null }) => {
  const taxes = 50000;
  return (
    <>
      <section className="flex flex-col gap-2">
        <Card className="xl:min-w-[340px] h-[350px]">
          <CardContent>
            <CardHeader className="flex flex-row items-center justify-between pl-0">
              <h2>{data?.roomId?.roomName}</h2>
            </CardHeader>
            {data?.roomId?.hotelId?.images?.[0] && <Image alt="room-pic" src={data?.roomId?.hotelId.images[0] || '/'} width={340} height={250} className="border max-h-[250px] w-full rounded-xl" />}
          </CardContent>
        </Card>
        <Card className="xl:min-w-[340px] h-[250px] text-sm">
          <CardContent className="pt-10">
            <CardTitle className="pl-0 text-xl font-semibold">Price Detail</CardTitle>
            <div className="flex justify-between mt-2">
              <ul className="flex flex-col">
                <li className="font-normal">1 night</li>
                <li className="text-xs font-light text-gray-500">{data?.roomId?.price?.toLocaleString()}₮ per night</li>
              </ul>
              <p>{data?.roomId?.price?.toLocaleString()}₮</p>
            </div>
            <div className="flex justify-between mt-3">
              <h5>Taxes</h5>
              <p>{taxes.toLocaleString()}₮</p>
            </div>
            <CardFooter className="flex justify-between px-0 border-t-[1px] pt-5 mt-5">
              <p>Total price</p>
              <p>{(Number(data?.roomId?.price) + 50000).toLocaleString()}₮</p>
            </CardFooter>
          </CardContent>
        </Card>
      </section>
    </>
  );
};

export default RoomInfo;
