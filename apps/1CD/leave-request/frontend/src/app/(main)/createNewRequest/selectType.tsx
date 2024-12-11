'use client';

import { FormikProps } from 'formik';
import { RequestFormValues } from './CreateNewRequest';
import { useEffect, useState } from 'react';
import { RadioGroupItem, RadioGroup } from '../../../../../../../../libs/shadcn/src/lib/ui/radio-group';
import { Input } from '@/components/ui/input';
import { DatePickerDemo } from '../../../components/ui/date-picker';
import { ComboboxDemo } from '../../../components/ui/combo-box';
import { CreateRequestQuery } from '@/generated';
import { Textarea } from '@/components/ui/textarea';
import { FileUpload } from '@/components/static/fileUpload';

export const ChooseHourlyOrDaily = ({ formik, data }: { formik: FormikProps<RequestFormValues>; data: CreateRequestQuery | undefined }) => {
  const [typeRequest, setType] = useState('');
  return (
    <div className="flex flex-col gap-2">
      <div className="text-[#000000] text-sm">Төрөл{(typeRequest && <></>) || <span className="text-[#EF4444]">*</span>}</div>
      <span className="text-[12px] text-[#71717A]">
        Хэрэв та ажлын 1 өдөрт багтаан 8 цагаас доош чөлөө авах бол <b>цагаар</b>, 8 цагаас илүү бол <b>өдрөөр</b> гэдгийг сонгоно уу.{' '}
      </span>

      <RadioGroup onValueChange={(e) => setType(e)} className="flex gap-4 mt-1">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="hourly" aria-label="Hourly Payment Option" className="cursor-pointer" />
          <span className="text-sm font-medium">Цагаар</span>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="daily" aria-label="Daily Payment Option" className="cursor-pointer" />
          <span className="text-sm font-medium">Өдрөөр</span>
        </div>
      </RadioGroup>
      {typeRequest && <PickDate formik={formik} typeRequest={typeRequest} />}
      {typeRequest == 'hourly' && <PickHours formik={formik} />}
      {formik.values.requestDate && <AdditionalInfo formik={formik} data={data} />}
      {formik.values.message && <FileUpload formik={formik}/>}
    </div>
  );
};

const PickDate = ({ formik, typeRequest }: { formik: FormikProps<RequestFormValues>; typeRequest: string }) => {
  const { requestDate } = formik.values;
  return (
    <div className="flex flex-col gap-2">
      <div className="text-[#000000] text-sm">Чөлөө авах өдөр{(requestDate && <></>) || <span className="text-[#EF4444]">*</span>}</div>
      <DatePickerDemo formik={formik} />
    </div>
  );
};

const PickHours = ({ formik }: { formik: FormikProps<RequestFormValues> }) => {
  return (
    <div className="flex gap-6">
      <div>
        <div className="text-[#000000] text-sm mb-2">Эхлэх цаг{(formik.values.startTime && <></>) || <span className="text-[#EF4444]">*</span>}</div>
        <Input type="time" onChange={(e) => formik.setFieldValue('startTime', e.target.value)} />
      </div>
      <div>
        <div className="text-[#000000] text-sm mb-2">Дуусах цаг{(formik.values.endTime && <></>) || <span className="text-[#EF4444]">*</span>}</div>
        <Input type="time" onChange={(e) => formik.setFieldValue('endTime', e.target.value)} />
      </div>
    </div>
  );
};

const AdditionalInfo = ({ formik, data }: { formik: FormikProps<RequestFormValues>; data: CreateRequestQuery | undefined }) => {
  const supervisorList = data!.getAllSupervisors!;
  if (!supervisorList) {
    return;
  }
  const options = supervisorList.map((supervisor) => supervisor && { label: supervisor.userName, value: supervisor.email }).filter((ele) => ele != null);
  return (
    <>
      <div>
        <div className="text-[#000000] text-sm mb-2">Хэнээр хүсэлтээ батлуулах аа сонгоно уу{(formik.values.supervisorEmail && <></>) || <span className="text-[#EF4444]">*</span>}</div>
        {options && (
          <ComboboxDemo
            options={options}
            onChange={(value) => {
              formik.setFieldValue('supervisorEmail', value);
            }}
          />
        )}
      </div>
      <div>
        <div className="text-[#000000] text-sm mb-2">Чөлөө авах шалтгаан{(formik.values.message && <></>) || <span className="text-[#EF4444]">*</span>}</div>
        <Textarea className="w-full" onChange={(e) => formik.setFieldValue('message', e.target.value)}/>
      </div>
    </>
  );
};

