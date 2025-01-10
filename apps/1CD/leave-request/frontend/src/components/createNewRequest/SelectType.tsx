/* eslint-disable max-lines */
'use client';

import { RequestFormValues } from './CreateNewRequest';
import { DatePickerDemo } from '../ui/DatePicker';
import { ComboboxDemo } from '../ui/ComboBox';
import { CreateRequestQuery } from '@/generated';
import { Textarea } from '@/components/ui/textarea';
import { FileUpload } from '@/components/static/FileUpload';
import { FormikProps } from 'formik';
import React, { useEffect, useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { generateHours } from '../../utils/generate-hourst';

type HourOption = { label: string; value: string };

export const ChooseHourlyOrDaily = ({ formik, data }: { formik: FormikProps<RequestFormValues>; data: CreateRequestQuery | undefined }) => {
  const [typeRequest, setType] = useState('');

  return (
    <div className="flex flex-col gap-2">
      {renderRequestTypeSelector()}
      {renderPickDate()}
      {typeRequest === 'hourly' && formik.values.requestType !== 'remote' && <PickHours formik={formik} />}
      <ConditionalComponents formik={formik} data={data} />
    </div>
  );

  function renderRequestTypeSelector() {
    if (formik.values.requestType !== 'remote') {
      return <RequestTypeSelector formik={formik} data={data} typeRequest={typeRequest} setType={setType} />;
    }
    return null;
  }

  function renderPickDate() {
    const { thisMonth } = data!.checkAvailavleRemoteLeaveInGivenMonth!;
    if (formik.values.requestType === 'remote') {
      if (!thisMonth) {
        return;
      }
      if (thisMonth > 0) return <PickDate formik={formik} />;
    }

    if (typeRequest) return <PickDate formik={formik} />;
    return null;
  }
};

// eslint-disable-next-line complexity
const RequestTypeSelector = ({
  formik,
  data,
  typeRequest,
  setType,
}: {
  formik: FormikProps<RequestFormValues>;
  data: CreateRequestQuery | undefined;
  typeRequest: string;
  setType: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const thisYear = data?.checkAvailablePaidLeaveInGivenYear?.thisYear;
  if (!thisYear) {
    return null;
  }
  return (
    <>
      <div className="text-[#000000] text-sm">
        Төрөл{typeRequest && <></>}
        <span className="text-[#EF4444]">*</span>
      </div>
      <span className="text-[12px] text-[#71717A]">
        Хэрэв та ажлын 1 өдөрт багтаан 8 цагаас доош чөлөө авах бол <b>цагаар</b>, 8 цагаас илүү бол <b>өдрөөр</b> гэдгийг сонгоно уу.
      </span>
      <RadioGroup onValueChange={setType} className="flex gap-4 mt-1">
        {(formik.values.requestType == 'unpaid' && (
          <>
            <RadioOption value="hourly" label="Цагаар" />
            <RadioOption value="daily" label="Өдрөөр" />
          </>
        )) || (
          <>
            {thisYear > 0 && <RadioOption value="hourly" label="Цагаар" />}
            {thisYear > 8 && <RadioOption value="daily" label="Өдрөөр" />}
          </>
        )}
      </RadioGroup>
    </>
  );
};

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
      <div className="text-[#000000] text-sm">
        Чөлөө авах өдөр{requestDate && <></>}
        <span className="text-[#EF4444]">*</span>
      </div>
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
    const { startTime, endTime } = formik.values;
    if (!endTime || parseTime(startTime) < parseTime(endTime)) {
      setValidation(true);
    } else {
      setValidation(false);
    }
  }, [formik.values.endTime, formik.values.startTime]);

  return (
    <div className="w-full grid grid-cols-2 gap-6">
      <div>
        <div className="text-[#000000] text-sm mb-2">
          Эхлэх цаг{validation && <></>}
          <span className="text-[#EF4444]">*</span>
        </div>
        <ComboboxDemo placeholder="00:00" haveSearch={false} options={generatedHours} onChange={(value) => formik.setFieldValue('startTime', value)} />
      </div>
      <div>
        <div className="text-[#000000] text-sm mb-2">
          Дуусах цаг{formik.values.endTime && <></>}
          <span className="text-[#EF4444]">*</span>
        </div>
        <ComboboxDemo placeholder="00:00" haveSearch={false} options={generatedHours} onChange={(value) => formik.setFieldValue('endTime', value)} />
      </div>
    </div>
  );
};

const AdditionalInfo = ({ formik, data }: { formik: FormikProps<RequestFormValues>; data: CreateRequestQuery | undefined }) => {
  if (!data?.getAllSupervisors) return null;

  const supervisorOptions = data.getAllSupervisors
    .map((supervisor) => (supervisor ? { label: supervisor.userName, value: supervisor.email } : null))
    // eslint-disable-next-line max-lines
    .filter((option): option is { label: string; value: string } => option !== null);

  return (
    <>
      <SupervisorSelector formik={formik} options={supervisorOptions} />
      <ReasonTextarea formik={formik} />
    </>
  );
};

const SupervisorSelector = ({ formik, options }: { formik: FormikProps<RequestFormValues>; options: { label: string; value: string }[] }) => (
  <div>
    <div className="text-[#000000] text-sm mb-2">
      Хэнээр хүсэлтээ батлуулах аа сонгоно уу
      {formik.values.supervisorEmail && <></>}
      <span className="text-[#EF4444]">*</span>
    </div>
    {options.length > 0 && <ComboboxDemo options={options} onChange={(value) => formik.setFieldValue('supervisorEmail', value)} />}
  </div>
);

const ReasonTextarea = ({ formik }: { formik: FormikProps<RequestFormValues> }) => (
  <div>
    <div className="text-[#000000] text-sm mb-2">
      Чөлөө авах шалтгаан
      {formik.values.message && <></>}
      <span className="text-[#EF4444]">*</span>
    </div>
    <Textarea className="w-full" onChange={(e) => formik.setFieldValue('message', e.target.value)} value={formik.values.message || ''} />
  </div>
);
