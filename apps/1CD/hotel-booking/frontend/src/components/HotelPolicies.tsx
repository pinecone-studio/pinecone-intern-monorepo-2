'use client';
import Image from 'next/image';

const HotelPolicies = () => {
  return (
    <div
      className="flex flex-col gap-20 md:flex-row'
        "
    >
      <div className="w-[264px]">
        <h3 className="text-2xl font-semibold">Policies</h3>
      </div>
      <div className="flex flex-col flex-1 gap-10">
        <div className="flex gap-2">
          <div className="flex flex-col flex-1 gap-2">
            <h4 className="text-xl font-semibold text-[#09090B]">Check-in</h4>
            <p className="text-sm font-normal text-[#09090B]">Check-in start time: noon Check-in end time: 5:30 AM</p>
            <p className="text-sm font-normal text-[#09090B]">Minimum check-in age: 16</p>
          </div>
          <div className="flex flex-col flex-1 gap-2">
            <h4 className="text-xl font-semibold text-[#09090B]">Check-in</h4>
            <p className="text-sm font-normal text-[#09090B]">Check-in start time: noon; Check-in end time: 5:30 AM</p>
            <p className="text-sm font-normal text-[#09090B]">Minimum check-in age: 16</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="text-xl font-semibold">Special check-in instructions</h4>
          <p className="text-sm font-normal">
            This property offers transfers from the airport (surcharges may apply); guests must contact the property with arrival details before travel, using the contact information on the booking
            confirmation
          </p>
          <p className="text-sm font-normal">Front desk staff will greet guests on arrival</p>
          <p className="text-sm font-normal">{"This property doesn't offer after-hours check-in"}</p>
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="text-xl font-semibold">Access methods</h4>
          <p className="text-sm font-normal">Staffed front desk</p>
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="text-xl font-semibold">Pets</h4>
          <p className="text-sm font-normal">No pets or service animals allowed</p>
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="text-xl font-semibold">Children and extra beds</h4>
          <p className="text-sm font-normal">Children are welcome</p>
          <p className="text-sm font-normal">Cribs (infant beds) are not available</p>
        </div>
        <div className="flex flex-col gap-2">
          <h4 className="text-xl font-semibold">Property payment types</h4>
          <div className="flex">
            <Image alt="logo" src="/images/cards-cc_jcb.png" width={500} height={500} className="w-20 h-12" />
            <Image alt="logo" src="/images/cards-cc_visa.png" width={500} height={500} className="w-20 h-12" />
            <Image alt="logo" src="/images/cards-cc_master_card.png" width={500} height={500} className="w-20 h-12" />
            <Image alt="logo" src="/images/cards-cc_american_express.png" width={500} height={500} className="w-20 h-12" />
          </div>
        </div>
      </div>
    </div>
  );
};
export default HotelPolicies;
