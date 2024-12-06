import { Input } from '@/components/ui/input';
import WhoChecking from '@/components/WhoChecking';

import { ChangeEvent } from 'react';
type BookingInformationInputFormikValues = {
  email: string;
  phoneNumber: string;
  cardNumber: string;
  cardName: string;
  month: string;
  year: string;
  securityCode: string;
  country: string;
  firstName: string;
  middleName: string;
  lastName: string;
};
export type BookingInformationInput = {
  formikHandleChange: (_e: string | ChangeEvent) => void;
  values: BookingInformationInputFormikValues;
};
const BookingInformationInput = ({ formikHandleChange, values }: BookingInformationInput) => {
  return (
    <div>
      <WhoChecking />
      <div className="flex flex-col gap-4 mt-8 text-[#09090B] text-sm">
        <div className="flex flex-col gap-2">
          <div>First name</div>
          <Input id="firstName" maxLength={32} onChange={formikHandleChange} value={values.firstName} />
          <div className="text-[#71717A]">Please give us the name of one of the people staying in this room.</div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-1">
            <div>Middle name</div>
            <div className="text-[#71717A]">(Option)</div>
          </div>
          <Input id="middleName" maxLength={32} onChange={formikHandleChange} value={values.middleName} />
        </div>
        <div>
          <div className="flex gap-1">
            <div>Last Name</div>
          </div>
          <Input type="text" maxLength={32} id="lastName" onChange={formikHandleChange} value={values.lastName} />
        </div>
      </div>
      <div className="h-[1px] w-full bg-[#E4E4E7] mt-[40px]"></div>
      <div className="flex flex-col gap-4 text-[#09090B]">
        <div className="text-xl">2. Contact Information</div>
        <div className="flex flex-col gap-2 text-sm">
          <div>Email address</div>
          <Input type="text" id="email" onChange={formikHandleChange} value={values.email} className="" />
          <div className="text-[#71717A]">Your confirmation email goes here</div>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <div>Phone number</div>
          <div className="flex gap-2.5">
            <div className="px-3 py-2 border-[#E4E4E7] border rounded-lg">+976</div>
            <Input type="number" id="phoneNumber" onChange={formikHandleChange} value={values.phoneNumber} className="flex-1" />
          </div>
        </div>
      </div>
      <div className="h-[1px] w-full bg-[#E4E4E7] mt-[40px]"></div>
    </div>
  );
};
export default BookingInformationInput;
