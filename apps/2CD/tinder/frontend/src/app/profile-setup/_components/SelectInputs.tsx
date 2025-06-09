import { ProfileFormValues } from '@/type/profile-form';
import type { FormikProps } from 'formik';

interface SelectInputsProps {
  formik: FormikProps<ProfileFormValues>;
}

export const SelectInputs = ({ formik }: SelectInputsProps) => {
    const genderOptions = ['Male', 'Female', 'Other'];
    const lookingForOptions = ['Male', 'Female', 'Both'];

    return (
        <div className="space-y-4">
            <div>
                <label htmlFor="gender" className="block text-sm mb-1.5">Gender</label>
                <select
                    id="gender"
                    name="gender"
                    value={formik.values.gender}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="bg-zinc-800 border border-zinc-700 rounded px-3 py-1.5 w-full text-sm text-white"
                >
                    <option value="" disabled>Select your gender</option>
                    {genderOptions.map((option: string) => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
                {formik.touched.gender && formik.errors.gender && (
                    <div className="text-red-500 text-xs mt-1">{formik.errors.gender}</div>
                )}
            </div>
            <div>
                <label htmlFor="lookingFor" className="block text-sm mb-1.5">Looking For</label>
                <select
                    id="lookingFor"
                    name="lookingFor"
                    value={formik.values.lookingFor}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="bg-zinc-800 border border-zinc-700 rounded px-3 py-1.5 w-full text-sm text-white"
                >
                    <option value="" disabled>Select who you are looking for</option>
                    {lookingForOptions.map((option: string) => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
                {formik.touched.lookingFor && formik.errors.lookingFor && (
                    <div className="text-red-500 text-xs mt-1">{formik.errors.lookingFor}</div>
                )}
            </div>
        </div>
    )
}