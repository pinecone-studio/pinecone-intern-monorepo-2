import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useAddHotelGeneralInfoMutation } from '@/generated';
import { GraphQLError } from 'graphql';

type AddHotelGeneralInfoType = {
  open: boolean;
  setOpen: (_: boolean) => void;
};
const AddHotelGeneralInfo = ({ open, setOpen }: AddHotelGeneralInfoType) => {
  const [addHotelGeneralInfo] = useAddHotelGeneralInfoMutation();

  const PhoneNumberError = () => {
    if (!formik.errors.phoneNumber || !formik.touched.phoneNumber) return <div></div>;
    return (
      <p data-testid="Phonenumber-Error" className="text-red-500">
        {formik.errors.phoneNumber}
      </p>
    );
  };

  const StarsRating = () => {
    if (!formik.errors.starsRating || !formik.touched.starsRating) return <div></div>;
    return (
      <p data-testid="Hotel-Stars-Rating" className="text-red-500">
        {formik.errors.starsRating}
      </p>
    );
  };
  const ReviewRating = () => {
    if (!formik.errors.rating || !formik.touched.rating) return <div></div>;
    return (
      <p data-testid="Review-Rating" className="text-red-500">
        {formik.errors.rating}
      </p>
    );
  };
  const HotelName = () => {
    if (!formik.errors.hotelName || !formik.touched.hotelName) return <div></div>;
    return (
      <p data-testid="Hotel-Name-Error" className="text-red-500">
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
    starsRating: yup.number().required('hotel stars rating is required'),
    phoneNumber: yup.number().min(7, 'phone number length must be 8'),
    rating: yup.number().required('hotel review is required'),
  });
  const formik = useFormik({
    initialValues,
    onSubmit: async (values) => {
      try {
        await addHotelGeneralInfo({
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
      } catch (err) {
        throw new GraphQLError((err as Error).message);
      }

      setOpen(false);
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
                <Input data-cy="Hotel-Name-Input" data-testid="Hotel-Name-Input" value={formik.values.hotelName} onChange={formik.handleChange} id="hotelName" />
                <HotelName />
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
                <Input
                  data-cy="Stars-Rating-Input"
                  data-testid="StarsRating"
                  value={formik.values.starsRating === 0 ? '' : formik.values.starsRating}
                  onChange={formik.handleChange}
                  id="starsRating"
                />
                <StarsRating />
              </div>
            </div>
            <div className="flex flex-col gap-2 text-sm">
              <div>Phone Number</div>
              <div>
                <Input data-cy="PhoneNumber-Input" data-testid="Phonenumber" value={formik.values.phoneNumber === 0 ? '' : formik.values.phoneNumber} onChange={formik.handleChange} id="phoneNumber" />
                <PhoneNumberError />
              </div>
            </div>
            <div className="flex flex-col gap-2 text-sm">
              <div>Rating</div>
              <div>
                <Input data-cy="Review-Rating-Input" data-testid="Review-Rating" value={formik.values.rating === 0 ? '' : formik.values.rating} onChange={formik.handleChange} id="rating" />
                <ReviewRating />
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
              <Button data-cy="Save-Button" data-testid="Save-Button" type="submit" className="text-white bg-[#2563EB] hover:bg-blue-400 active:bg-blue-300">
                Save
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default AddHotelGeneralInfo;
