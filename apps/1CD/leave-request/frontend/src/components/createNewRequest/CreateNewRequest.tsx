'use client';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

import { useCreateRequestQuery, useCreatesRequestMutation } from '@/generated';
import { SelectRequestType } from './SelectRequestType';
import { useFormik } from 'formik';
import { ChooseHourlyOrDaily } from './SelectType';
import { uploadFilesInCloudinary } from '@/utils/upload-files';
import { useMessage } from '@/context/MessageContext';
import Image from 'next/image';

const RequestSuccessDiv = () => {
  return (
    <div className='fixed inset-0 flex justify-center items-center bg-[#0000004D]'>
    
      <div className="max-w-[608px] text-center w-full flex flex-col items-center gap-8 p-8 broder-[1px] border-[#E4E4E7] rounded-[8px] inset-x-auto bg-[#FFFFFF]">
        <Image src={'/sent.png'} alt="Success" width={80} height={80} />
        <div>
          <h1 className='text-2xl text-center'>Амжилттай илгээгдлээ </h1>
          <span className=' text-sm text-[#71717A]'>Таны хүсэлттэй ахлах ажилтан танилцсаны дараа хариуг танд Teams Chat-аар мэдэгдэх болно.</span>
        </div>
      </div>
    </div>
  );
};

export interface RequestFormValues {
  requestType: string;
  requestDate?: Date;
  startTime: string;
  endTime: string;
  supervisorEmail: string;
  message: string;
  optionalFile: File | null;
}

export const CreateNewRequest = ({ email }: { email: string }) => {
  const { data } = useCreateRequestQuery({ variables: { email } });
  const { setMessage } = useMessage();
  const [createRequest] = useCreatesRequestMutation();
  const formik = useFormik<RequestFormValues>({
    initialValues: {
      requestType: '',
      requestDate: undefined,
      startTime: '',
      endTime: '',
      supervisorEmail: '',
      message: '',
      optionalFile: null,
    },
    onSubmit: async () => {
      try {
        const optionalFileUrl = formik.values.optionalFile ? await uploadFilesInCloudinary(formik.values.optionalFile) : '';

        const { requestType, requestDate, startTime, endTime, supervisorEmail, message } = formik.values;


        const variables = {
          requestType,
          requestDate,
          startTime,
          endTime,
          supervisorEmail,
          message,
          email,
          optionalFile: optionalFileUrl,
        };

        await createRequest({ variables });

        formik.resetForm()

        setMessage(<RequestSuccessDiv />);
      } catch (error) {
        console.error('Submission error:', error);
      }
    },
  });

  return (
    <div className="w-[600px] mx-auto p-8 mt-8">
      <div className="border rounded-lg">
        <div className="p-7 grid gap-8">
          <div className="grid gap-1.5">
            <div className="text-[#000000] text-xl">Чөлөөний хүсэлт</div>
            <div className="text-[#71717A] text-sm">Ажлын цагаар оффис дээр байх боломжгүй болсон аль ч тохиолдолд тус формыг заавал бөглөнө. </div>
          </div>
          <form onSubmit={formik.handleSubmit}>
            <div className="flex flex-col gap-1.5">
              <SelectRequestType formik={formik} data={data} />
              {formik.values.requestType && <ChooseHourlyOrDaily formik={formik} data={data} />}
              <div className="flex justify-end w-full">
                <Button disabled={!formik.values.message} type="submit" className="w-[150px] gap-1.5 text-[#FAFAFA]">
                  <Send size={14} />
                  Хүсэлт илгээх
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
