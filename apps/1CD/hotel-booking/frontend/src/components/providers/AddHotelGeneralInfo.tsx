import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import * as yup from 'yup';
import { useFormik } from 'formik';

type AddHotelGeneralInfoType = {
  open: boolean;
  setOpen: (_value: boolean) => void;
};
const AddHotelGeneralInfo = ({ open, setOpen }: AddHotelGeneralInfoType) => {
  const initialValues = {
    hotelName: '',
    description: '',
    starsRating: '',
    phoneNumber: '',
    rating: '',
  };
  const validationSchema = yup.object({
    hotelName: yup.string().required('hotel name is required'),
    description: yup.string().max(100, 'description max length is 100 character'),
    starsRating: yup.string().required('hotel stars rating is required'),
    phoneNumber: yup.number().min(7, 'phone number length must be 8').max(8, 'phone number length must be 8'),
    rating: yup.string().required('hotel review is required'),
  });
  const formik = useFormik({
    initialValues,
    onSubmit: () => {
      console.log('');
    },
    validationSchema,
  });

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-[626px] w-full">
        <form onSubmit={formik.handleSubmit} className="text-[#09090B]">
          <div className="pb-6 text-base">General Info</div>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2 text-sm">
              <div>Name</div>
              <div>
                <Input value={formik.values.hotelName} onChange={formik.handleChange} id="hotelName" />
              </div>
            </div>
            <div className="flex flex-col gap-2 text-sm">
              <div>Descriptoin</div>
              <div>
                <Textarea maxLength={100} value={formik.values.description} onChange={formik.handleChange} id="description" />
              </div>
            </div>
            <div className="flex flex-col gap-2 text-sm">
              <div>Stars Rating</div>
              <div>
                <Input value={formik.values.starsRating} onChange={formik.handleChange} id="starsRating" />
              </div>
            </div>
            <div className="flex flex-col gap-2 text-sm">
              <div>Phone Number</div>
              <div>
                <Input value={formik.values.phoneNumber} onChange={formik.handleChange} id="phoneNumber" />
                {formik.errors.phoneNumber && formik.touched.phoneNumber && <p className="text-red-500">{formik.errors.phoneNumber}</p>}
              </div>
            </div>
            <div className="flex flex-col gap-2 text-sm">
              <div>Rating</div>
              <div>
                <Input value={formik.values.rating} onChange={formik.handleChange} id="rating" />
                {formik.errors.rating && formik.touched.rating && <p className="text-red-500">{formik.errors.rating}</p>}
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-6">
            <div>
              <Button onClick={() => setOpen(false)} className="bg-[#FFFFFF] hover:bg-slate-100 active:bg-slate-200 text-black">
                Cancel
              </Button>
            </div>
            <div>
              <Button className="text-white bg-[#2563EB] hover:bg-blue-400 active:bg-blue-300">Save</Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default AddHotelGeneralInfo;
