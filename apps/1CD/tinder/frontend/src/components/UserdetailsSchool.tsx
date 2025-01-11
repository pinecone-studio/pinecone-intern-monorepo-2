'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const UserdetailsSchool = ({ formik }: any) => {
  return (
    <div className="grid w-[400px] max-w-sm items-center gap-1.5 max-sm:w-[350px] ">
      <Label htmlFor="schoolWork" className="text-[#09090B] font-medium text-sm">
        School/Work
      </Label>
      <Input type="text" id="schoolWork" placeholder="Enter your school/work" value={formik.values.schoolWork} onChange={formik.handleChange} data-cy="User-Details-schoolWork-Input" />
      {formik.errors.schoolWork && formik.touched.schoolWork && (
        <span className="text-red-600" data-cy="User-Details-SchoolWork-Input-Error-Message">
          {formik.errors.schoolWork}
        </span>
      )}
    </div>
  );
};
