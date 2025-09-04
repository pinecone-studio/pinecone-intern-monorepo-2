'use client';

import { NameField, TypeField, PriceField, RoomInformationField, BedNumberField, StatusField } from './GeneralFormFields';

interface GeneralFormProps {
  formData: FormData;
  errors: Record<string, string>;
  onInputChange: (_field: keyof FormData, _value: string | string[]) => void;
}

interface FormData {
  name: string;
  type: string[];
  pricePerNight: string;
  roomInformation: string[];
  bedNumber: number;
  status: string;
}

export const GeneralForm = (props: GeneralFormProps) => (
  <div className="space-y-4">
    <NameField {...props} />
    <TypeField {...props} />
    <PriceField {...props} />
    <BedNumberField {...props} />
    <StatusField {...props} />
    <RoomInformationField {...props} />
  </div>
);
