import { DialogInputs } from "../_components/DialogInputs";
import { SelectInputs } from "../_components/SelectInputs";
import { TextInputs } from "../_components/TextInputs";

export const ProfileForm = ({ formik }: any) => {
  return (
    <div className="space-y-4">
      
      <TextInputs formik={formik} />
      <SelectInputs formik={formik} />
      <DialogInputs formik={formik} />
    </div>
  );
};