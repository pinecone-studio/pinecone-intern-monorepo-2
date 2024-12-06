'use client';
import { Input } from '@/components/ui/input';

import { ChangeEvent, useState } from 'react';
import { BookingInformationInput } from './BookingInformationInput';
interface CardInformationType extends BookingInformationInput {
  setFieldValue: (_name: string, _value: string) => void;
}
const CardInformation = ({ values, formikHandleChange, setFieldValue }: CardInformationType) => {
  const [cardExpirationDate, setCardExpirationDate] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCardExpirationDate(e.target.value);

    if (e.target.value.length > 3) {
      setFieldValue('month', e.target.value[0] + e.target.value[1]);
      setFieldValue('year', e.target.value[2] + e.target.value[3]);
    }
  };
  return (
    <div className="flex flex-col gap-4 text-sm text-[#09090B]">
      <div>
        <div className="mb-2">Name on card</div>
        <Input id="cardName" onChange={formikHandleChange} value={values.cardName} />
      </div>
      <div>
        <div className="mb-2">Number on card</div>
        <Input id="cardNumber" onChange={formikHandleChange} value={values.cardNumber} />
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="mb-2">Expiration date</div>
          <Input type="text" maxLength={5} placeholder="MM/YY" min={new Date().getTime()} onChange={(e) => handleChange(e)} value={cardExpirationDate} />
        </div>
        <div className="flex-1">
          <div className="mb-2">Security code</div>
          <Input placeholder="CVV" />
        </div>
      </div>
      <div>
        <div className="mb-2">Country</div>
        <Input placeholder="Hong Kong" />
      </div>
    </div>
  );
};

export default CardInformation;
