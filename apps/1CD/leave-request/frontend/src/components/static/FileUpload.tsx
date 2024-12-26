import { RequestFormValues } from '@/components/createNewRequest/CreateNewRequest';
import { FormikProps } from 'formik';
import { Input } from '@/components/ui/input';

export const FileUpload = ({ formik }: { formik: FormikProps<RequestFormValues> }) => {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <div className="text-[#000000] text-sm mb-2">Хавсаргах материал (Заавал биш)</div>
      <Input id="picture" type="file" onChange={(e) => formik.setFieldValue('optionalFile', e.target.files![0] || null)} />
    </div>
  );
};
