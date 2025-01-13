'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const UserdetailsProfession = ({ formik }: any) => {
  return (
    <div className="grid w-[400px] max-w-sm items-center gap-1.5 max-sm:w-[350px] ">
      <Label htmlFor="profession" className="text-[#09090B] font-medium text-sm">
        Profession
      </Label>
      <Input
        type="text"
        id="profession"
        placeholder="Enter your profession"
        value={formik.values.profession}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        data-cy="User-Details-Profession-Input"
      />
      {formik.errors.profession && formik.touched.profession && (
        <span className="text-red-600" data-cy="User-Details-Profession-Input-Error-Message">
          {formik.errors.profession}
        </span>
      )}
    </div>
  );
};
