import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { FormikProps } from 'formik';
import { RequestFormValues } from './CreateNewRequest';
import { CreateRequestQuery } from '@/generated';

export const SelectRequestType = ({ formik, data }: { formik: FormikProps<RequestFormValues>; data: CreateRequestQuery | undefined }) => {
  const { requestType } = formik.values;
  const thisYear = data?.checkAvailablePaidLeaveInGivenYear?.thisYear;
  const thisMonth = data?.checkAvailavleRemoteLeaveInGivenMonth?.thisMonth;
  return (
    <>
      <div className="text-[#000000] text-sm">Ангилал{(requestType && <></>) || <span className="text-[#EF4444]">*</span>}</div>
      <Select
        onValueChange={(e) => {
          formik.setFieldValue('requestType', e);
        }}
      >
        <SelectTrigger id='requestTypeInput'>
          <SelectValue placeholder="Сонгоно уу" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup id='requestTypeOptions'>
            <SelectItem value="unpaid">Чөлөө</SelectItem>
            <SelectItem value="paid">Цалинтай чөлөө</SelectItem>
            <SelectItem value="remote">Зайнаас ажиллах</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <div className="flex items-center gap-1 justify-end">
        <div className="text-xs text-[#71717A]">Боломжит хугацаа:</div>
        <div className="text-sm font-sans text-[#000000] ">
          {AvailableTime(requestType, Number(thisYear), Number(thisMonth))}
        </div>
      </div>
    </>
  );
};

const AvailableTime = (requestType: string, thisYear: number, thisMonth: number) => {
  return (requestType == 'paid' && `${Math.floor(Number(thisYear) / 8)} хоног ${Number(thisYear) % 8} цаг`) || (requestType == 'remote' && `${thisMonth} хоног`) || '-'
}

