'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const UserdetailsName = ({ formik }: any) => {
  return (
    <div className="grid w-[400px] max-w-sm items-center gap-1.5 max-sm:w-[350px] ">
      <Label htmlFor="name" className="text-[#09090B] font-medium text-sm">
        Name
      </Label>
      <Input type="text" id="name" placeholder="Enter your name" value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} data-cy="User-Details-Name-Input" />
      {formik.errors.name && formik.touched.name && (
        <span className="text-red-600" data-cy="User-Details-Name-Input-Error-Message">
          {formik.errors.name}
        </span>
      )}
    </div>
  );
};
