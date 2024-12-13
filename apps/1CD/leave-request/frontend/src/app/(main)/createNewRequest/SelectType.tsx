'use client';

import { RequestFormValues } from './CreateNewRequest';
import { DatePickerDemo } from '../../../components/ui/DatePicker';
import { ComboboxDemo } from '../../../components/ui/ComboBox';
import { CreateRequestQuery } from '@/generated';
import { Textarea } from '@/components/ui/textarea';
import { FileUpload } from '@/components/static/FileUpload';
type HourOption = { label: string; value: string };
import React, { useEffect, useState } from 'react';
import { FormikProps } from 'formik';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { generateHours } from './generate-hourst';

export const ChooseHourlyOrDaily = ({ formik, data }: { formik: FormikProps<RequestFormValues>; data: CreateRequestQuery | undefined }) => {
  const [typeRequest, setType] = useState('');

  return (
    <div className="flex flex-col gap-2">
      <RequestTypeSelector typeRequest={typeRequest} setType={setType} />
      {typeRequest && <PickDate formik={formik} />}
      {typeRequest === 'hourly' && <PickHours formik={formik} />}
      <ConditionalComponents formik={formik} data={data} />
    </div>
  );
};

const RequestTypeSelector = ({ typeRequest, setType }: { typeRequest: string; setType: React.Dispatch<React.SetStateAction<string>> }) => (
  <>
    <div className="text-[#000000] text-sm">Төрөл{(typeRequest && <></>) || <span className="text-[#EF4444]">*</span>}</div>
    <span className="text-[12px] text-[#71717A]">
      Хэрэв та ажлын 1 өдөрт багтаан 8 цагаас доош чөлөө авах бол <b>цагаар</b>, 8 цагаас илүү бол <b>өдрөөр</b> гэдгийг сонгоно уу.
    </span>
    <RadioGroup onValueChange={(e) => setType(e)} className="flex gap-4 mt-1">
      <RadioOption value="hourly" label="Цагаар" />
      <RadioOption value="daily" label="Өдрөөр" />
    </RadioGroup>
  </>
);

const RadioOption = ({ value, label }: { value: string; label: string }) => (
  <div className="flex items-center space-x-2">
    <RadioGroupItem value={value} aria-label={`${label} Payment Option`} className="cursor-pointer" />
    <span className="text-sm font-medium">{label}</span>
  </div>
);

const ConditionalComponents = ({ formik, data }: { formik: FormikProps<RequestFormValues>; data: CreateRequestQuery | undefined }) => (
  <>
    {formik.values.requestDate && <AdditionalInfo formik={formik} data={data} />}
    {formik.values.message && <FileUpload formik={formik} />}
  </>
);

const PickDate = ({ formik }: { formik: FormikProps<RequestFormValues> }) => {
  const { requestDate } = formik.values;
  return (
    <div className="flex flex-col gap-2">
      <div className="text-[#000000] text-sm">Чөлөө авах өдөр{(requestDate && <></>) || <span className="text-[#EF4444]">*</span>}</div>
      <DatePickerDemo formik={formik} />
    </div>
  );
};

const PickHours = ({ formik }: { formik: FormikProps<RequestFormValues> }) => {
  const generatedHours: HourOption[] = generateHours();
  const [validation, setValidation] = useState(false);
  const parseTime = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };
  useEffect(() => {
    const { endTime, startTime } = formik.values;
    if (!endTime) {
      setValidation(false);
    }
    if (parseTime(startTime) >= parseTime(endTime)) {
      setValidation(false);
      return;
    }
    setValidation(true);
  }, [formik.values.endTime]);
  return (
    <div className="w-full grid grid-cols-2 gap-6">
      <div>
        <div className="text-[#000000] text-sm mb-2">Эхлэх цаг{(validation && <></>) || <span className="text-[#EF4444]">*</span>}</div>
        <ComboboxDemo
          placeholder="00:00"
          haveSearch={false}
          options={generatedHours}
          onChange={(value) => {
            formik.setFieldValue('startTime', value);
          }}
        />
      </div>
      <div>
        <div className="text-[#000000] text-sm mb-2">Дуусах цаг{(formik.values.endTime && <></>) || <span className="text-[#EF4444]">*</span>}</div>
        <ComboboxDemo
          placeholder="00:00"
          haveSearch={false}
          options={generatedHours}
          onChange={(value) => {
            formik.setFieldValue('endTime', value);
          }}
        />
      </div>
    </div>
  );
};

const AdditionalInfo = ({ formik, data }: { formik: FormikProps<RequestFormValues>; data: CreateRequestQuery | undefined }) => {
  if (!data?.getAllSupervisors) return null;

  const supervisorList = data.getAllSupervisors;
  const options = supervisorList
    .map((supervisor) => (supervisor ? { label: supervisor.userName, value: supervisor.email } : null))
    .filter((option): option is { label: string; value: string } => option !== null);

  return (
    <>
      <SupervisorSelector formik={formik} options={options} />
      <ReasonTextarea formik={formik} />
    </>
  );
};

const SupervisorSelector = ({ formik, options }: { formik: FormikProps<RequestFormValues>; options: { label: string; value: string }[] }) => (
  <div>
    <div className="text-[#000000] text-sm mb-2">
      Хэнээр хүсэлтээ батлуулах аа сонгоно уу
      {(formik.values.supervisorEmail && <></>) || <span className="text-[#EF4444]">*</span>}
    </div>
    {options.length > 0 && (
      <ComboboxDemo
        options={options}
        onChange={(value) => {
          formik.setFieldValue('supervisorEmail', value);
        }}
      />
    )}
  </div>
);

const ReasonTextarea = ({ formik }: { formik: FormikProps<RequestFormValues> }) => (
  <div>
    <div className="text-[#000000] text-sm mb-2">
      Чөлөө авах шалтгаан
      {(formik.values.message && <></>) || <span className="text-[#EF4444]">*</span>}
    </div>
    <Textarea className="w-full" onChange={(e) => formik.setFieldValue('message', e.target.value)} value={formik.values.message || ''} />
  </div>
);
