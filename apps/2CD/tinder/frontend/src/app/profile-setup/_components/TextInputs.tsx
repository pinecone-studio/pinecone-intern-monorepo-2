import { ProfileFormValues } from "@/type/profile-form";
import type { FormikProps } from "formik";

interface TextInputsProps {
  formik: FormikProps<ProfileFormValues>;
}

interface FieldProps {
  id: keyof ProfileFormValues;
  label: string;
  type?: string;
  helperText?: string;
  formik: FormikProps<ProfileFormValues>;
}

const TextInputField = ({ id, label, type = "text", helperText, formik }: FieldProps) => (
  <div>
    <label htmlFor={id} className="block text-sm mb-1">{label}</label>
    <input
      id={id}
      name={id}
      type={type}
      value={formik.values[id] as string | number}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      className="bg-zinc-800 border border-zinc-700 rounded px-3 py-1.5 w-full text-sm text-white"
    />
    {helperText && <p className="text-xs text-zinc-400 mt-1">{helperText}</p>}
    {formik.touched[id] && formik.errors[id] && (
      <div className="text-red-500 text-xs mt-1">{formik.errors[id]}</div>
    )}
  </div>
);

const TextAreaField = ({ id, label, formik }: FieldProps) => (
  <div>
    <label htmlFor={id} className="block text-sm mb-1">{label}</label>
    <textarea
      id={id}
      name={id}
      value={formik.values[id] as string}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      rows={4}
      placeholder="Tell us about yourself..."
      className="bg-zinc-800 border border-zinc-700 rounded px-3 py-1.5 w-full text-sm text-white resize-y"
    />
    {formik.touched[id] && formik.errors[id] && (
      <div className="text-red-500 text-xs mt-1">{formik.errors[id]}</div>
    )}
  </div>
);

export const TextInputs = ({ formik }: TextInputsProps) => {
  return (
    <div className="space-y-4">
      <TextInputField
        id="firstName"
        label="First Name"
        helperText="This is how it&apos;ll appear on Tinder"
        formik={formik}
      />
      <TextInputField id="age" label="Age" type="number" formik={formik} />
      <TextAreaField id="bio" label="Bio" formik={formik} />
      <TextInputField id="profession" label="Profession" formik={formik} />
      <TextInputField id="education" label="Education" formik={formik} />
    </div>
  );
};
