import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useAddHotelGeneralInfoMutation } from '@/generated';
import SelectHotelStars from '@/components/SelectHotelStars';
import SelectHotelReviewRating from '@/components/ReviewRating';
import { Dialog, DialogContent } from '@/components/providers/HotelBookingDialog';

import { toast } from 'sonner';

type AddHotelGeneralInfoType = {
  open: boolean;
  setOpen: (_: boolean) => void;
  refetch: () => void;
};
const AddHotelGeneralInfo = ({ open, setOpen, refetch }: AddHotelGeneralInfoType) => {
  const [AddHotelGeneralInfo] = useAddHotelGeneralInfoMutation({
    onCompleted: () => refetch(),
  });

  const PhoneNumberError = () => {
    if (!formik.errors.phoneNumber || !formik.touched.phoneNumber) return <div></div>;
    return (
      <p data-cy="Phonenumber-Error" className="text-red-500">
        {formik.errors.phoneNumber}
      </p>
    );
  };

  const StarsRating = () => {
    if (!formik.errors.starsRating || !formik.touched.starsRating) return <div></div>;
    return (
      <p data-cy="Hotel-Stars-Rating" className="text-red-500">
        {formik.errors.starsRating}
      </p>
    );
  };
  const ReviewRating = () => {
    if (!formik.errors.rating || !formik.touched.rating) return <div></div>;
    return (
      <p data-cy="Review-Rating" className="text-red-500">
        {formik.errors.rating}
      </p>
    );
  };
  const HotelName = () => {
    if (!formik.errors.hotelName || !formik.touched.hotelName) return <div></div>;
    return (
      <p data-cy="Hotel-Name-Error" className="text-red-500">
        {formik.errors.hotelName}
      </p>
    );
  };
  const initialValues = {
    hotelName: '',
    description: '',
    starsRating: 0,
    phoneNumber: 0,
    rating: 0,
  };
  const validationSchema = yup.object({
    hotelName: yup.string().required('hotel name is required'),
    description: yup.string(),
    starsRating: yup.number().required('hotel stars rating is required').min(1, 'hotel stars rating is required'),
    phoneNumber: yup.number().min(7, 'phone number length must be 8'),
    rating: yup.number().required('hotel review is required').min(1, 'hotel review is required'),
  });
  const formik = useFormik({
    initialValues,
    onSubmit: async (values) => {
      await AddHotelGeneralInfo({
        variables: {
          input: {
            hotelName: values.hotelName,
            description: values.description,
            starRating: Number(values.starsRating),
            userRating: Number(values.rating),
            phoneNumber: Number(values.phoneNumber),
          },
        },
      });
      toast('successfully updated your general info', {
        style: {
          border: 'green solid 1px',
          color: 'green',
        },
      });
      setOpen(false);
    },
    validationSchema,
  });

  return (
    <div>
      <Dialog open={open}>
        <DialogContent className="max-w-[626px] bg-blue-50 w-full">
          <form data-cy="Hotel-General-Info-Page" onSubmit={formik.handleSubmit} className="text-[#09090B]">
            <div className="pb-6 text-base text-[#2563EB] font-semibold">General Info</div>
            <div className="flex flex-col gap-6 ">
              <div className="flex flex-col gap-2 text-sm bg-blue-50">
                <div>Name</div>
                <div>
                  <Input  data-cy="Hotel-Name-Input" value={formik.values.hotelName} onChange={formik.handleChange} id="hotelName" />
                  <HotelName />
                </div>
              </div>
              <div className="flex flex-col gap-2 text-sm">
                <div>Description</div>
                <div>
                  <Textarea maxLength={100} value={formik.values.description} onChange={formik.handleChange} id="description" />
                </div>
              </div>
              <div className="flex flex-col gap-2 text-sm">
                <div>Stars Rating</div>
                <div>
                  <SelectHotelStars value={formik.values.starsRating} setFieldValue={formik.setFieldValue} />
                  <StarsRating />
                </div>
              </div>
              <div className="flex flex-col gap-2 text-sm">
                <div>Phone Number</div>
                <div>
                  <Input data-cy="PhoneNumber-Input" value={formik.values.phoneNumber === 0 ? '' : formik.values.phoneNumber} onChange={formik.handleChange} id="phoneNumber" />
                  <PhoneNumberError />
                </div>
              </div>
              <div className="flex flex-col gap-2 text-sm">
                <div>Rating</div>
                <div>
                  <SelectHotelReviewRating value={formik.values.rating} setFieldValue={formik.setFieldValue} />
                  <ReviewRating />
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <div>
                <Button data-cy="Cancel-Button" onClick={() => setOpen(false)} className="bg-[#FFFFFF] border hover:bg-slate-100 active:bg-slate-200 text-black">
                  Cancel
                </Button>
              </div>
              <div>
                <Button type="submit" data-cy="Save-Button" className="text-white bg-[#2563EB] hover:bg-blue-400 active:bg-blue-300">
                  Save
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default AddHotelGeneralInfo;
