'use client';
import { Input } from '@/components/ui/input';
import { ChangeEvent } from 'react';
import { BookingInformationInput } from './BookingInformationInput';
import SelectCountry from '@/components/SelectCountry';
import { CardCountry, CardNameErrorMessage, CardNumberErrorMessage, ExpirationDateErrorMessage, SecurityCodeErrorMessage } from './BookingErrorMessages';
interface CardInformationType extends BookingInformationInput {
  setFieldValue: (_name: string, _value: string) => void;
}
const CardInformation = ({ values, formikHandleChange, errors, touched, setFieldValue }: CardInformationType) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, '');
    const formatted = input.replace(/(\d{4})(?=\d)/g, '$1 ');
    setFieldValue('cardNumber', formatted);
  };
  const handleExpirationDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
    if (input.length > 2) input = input.slice(0, 2) + '/' + input.slice(2); // Add '/' after MM
    setFieldValue('ExpirationDate', input);
  };
  const handleSecurityCode = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const result = input.replace(/[a-zA-Z]/g, ''); // Remove non-numeric characters
    setFieldValue('securityCode', result);
  };
  return (
    <div data-cy="Card-Information-Inputs" className="flex flex-col gap-4 text-sm text-[#09090B]">
      <div>
        <div className="mb-2">Name on card</div>
        <Input data-cy="CardName-Input" id="cardName" onChange={formikHandleChange} value={values.cardName} />
        <CardNameErrorMessage errors={errors} touched={touched} />
      </div>
      <div>
        <div className="mb-2">Number on card</div>
        <Input
          data-cy="CardNumber-Input"
          type="text"
          id="cardNumber"
          maxLength={19}
          value={values.cardNumber}
          onChange={handleChange}
          placeholder="1234 5678 9012 3456"
          className="w-full px-4 py-2 border rounded-md focus:outline-none"
        />
        <CardNumberErrorMessage errors={errors} touched={touched} />
      </div>
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="mb-2">Expiration date</div>
          <Input data-cy="ExpiratoinDate-Input" id="ExpirationDate" type="text" maxLength={5} placeholder="MM/YY" onChange={handleExpirationDateChange} value={values.ExpirationDate} />
          <ExpirationDateErrorMessage errors={errors} touched={touched} />
        </div>
        <div className="flex-1">
          <div className="mb-2">Security code</div>
          <Input data-cy="Security-Code-Input" id="securityCode" placeholder="CVV" type="text" maxLength={3} onChange={handleSecurityCode} value={values.securityCode} max={999} />
          <SecurityCodeErrorMessage errors={errors} touched={touched} />
        </div>
      </div>
      <div>
        <div className="mb-2">Country</div>
        <SelectCountry setFieldValue={setFieldValue} />
        <CardCountry errors={errors} touched={touched} />
      </div>
    </div>
  );
};

export default CardInformation;
