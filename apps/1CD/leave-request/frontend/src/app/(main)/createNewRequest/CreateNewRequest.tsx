'use client';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

import { useCreateRequestQuery } from '@/generated';
import { SelectRequestType } from './SelectRequestType';
import { useFormik } from 'formik';
import { ChooseHourlyOrDaily } from './selectType';

export interface RequestFormValues {
  requestType: string ;
  requestDate?: Date;
  startTime: string;
  endTime: string;
  supervisorEmail: string;
  message: string;
  files: File[]
}

export const CreateNewRequest = ({ email }: { email: string }) => {
  const { data } = useCreateRequestQuery({ variables: { email } });
  const formik = useFormik<RequestFormValues>({
    initialValues: {
      requestType: "",
      requestDate: undefined,
      startTime: '',
      endTime: '',
      supervisorEmail: '',
      message: '',
      files: []
    },
    onSubmit: () => {
      console.log(formik.values);
    },
  });
  console.log(data);

  return (
    <div className="w-[600px] mx-auto p-8">
      <div className="border rounded-lg">
        <div className="p-7 grid gap-8">
          <div className="grid gap-1.5">
            <div className="text-[#000000] text-xl">Чөлөөний хүсэлт</div>
            <div className="text-[#71717A] text-sm">Ажлын цагаар оффис дээр байх боломжгүй болсон аль ч тохиолдолд тус формыг заавал бөглөнө. </div>
          </div>
          <form onSubmit={formik.handleSubmit}>
            <div className="flex flex-col gap-1.5">
              <SelectRequestType formik={formik} data={data} />
              {formik.values.requestType && <ChooseHourlyOrDaily formik={formik} data={data}/>}
              <div className="flex justify-end w-full">
                <Button type="submit" className="w-[150px] gap-1.5 text-[#FAFAFA]">
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
