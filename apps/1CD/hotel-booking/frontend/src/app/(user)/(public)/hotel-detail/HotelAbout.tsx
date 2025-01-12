'use client';

import { Hotel } from "@/generated";

const HotelAbout = ({hotel}: {hotel: Hotel | undefined}) => {

  return (
    <div className="flex gap-20" data-cy="hotel-about">
      <div className="w-[264px] text-2xl font-semibold">About this property </div>
      <div className="flex-1 flex flex-col gap-10">
        <div className="flex flex-1 flex-col gap-2">
          <div className="text-xl font-semibold">{hotel?.hotelName}</div>
          <div className="text-sm font-normal">{hotel?.location}</div>
          <div className="text-sm font-normal">{hotel?.description}</div>
        </div>
        <div>
          <ul className="text-sm font-normal">Additional perks include:</ul>
          <li className="text-sm font-normal">Free self parking</li>
          <li className="text-sm font-normal"> Buffet breakfast (surcharge), a roundtrip airport shuttle (surcharge), and a front-desk safe</li>
          <li className="text-sm font-normal">A banquet hall, newspapers in the lobby, and concierge services</li>
          <li className="text-sm font-normal">Guest reviews speak highly of the helpful staff</li>
          <p className="text-sm font-normal">Room features All 180 rooms boast comforts such as premium bedding and bathrobes, in addition to perks like free WiFi and safes.</p>
          <ul className="text-sm font-normal">Other conveniences in all rooms include: </ul>
          <li className="text-sm font-normal">Rainfall showers, tubs or showers, and free toiletries</li>
          <li className="text-sm font-normal">TVs with satellite channels</li>
          <li className="text-sm font-normal">Electric kettles, ceiling fans, and daily housekeeping</li>
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="text-xl font-semibold">Languages</h4>
          <p className="text-sm font-normal">English, Japanese, Mongolian, Russian</p>
        </div>
      </div>
    </div>
  );
};
export default HotelAbout;
