/* eslint-disable */

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { Hotel, useUpdateHotelGeneralInfoMutation } from '@/generated';
import SelectHotelStars from '@/components/SelectHotelStars';
import SelectHotelReviewRating from '@/components/ReviewRating';
import { Dialog, DialogContent } from '@/components/providers/HotelBookingDialog';
import { useEffect } from 'react';
import { toast } from 'sonner';

type AddHotelGeneralInfoType = {
  open: boolean;
  setOpen: (_: boolean) => void;
  hotelData: Hotel | undefined;
  AllQueriesRefetch: () => void;
};
const UpdateHotelGeneralInfo = ({ open, setOpen, hotelData, AllQueriesRefetch }: AddHotelGeneralInfoType) => {
  const [updateHotelGeneralInfo] = useUpdateHotelGeneralInfoMutation({
    onCompleted: () => {
      AllQueriesRefetch();
    },
  });

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
      await updateHotelGeneralInfo({
        variables: {
          id: String(hotelData?._id),
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
  useEffect(() => {
    if (hotelData?.hotelName) formik.setFieldValue('hotelName', hotelData.hotelName);
    if (hotelData?.description) formik.setFieldValue('description', hotelData.description);
    if (hotelData?.starRating) formik.setFieldValue('starsRating', hotelData.starRating);
    if (hotelData?.userRating) formik.setFieldValue('rating', hotelData.userRating);
    if (hotelData?.phoneNumber) formik.setFieldValue('phoneNumber', hotelData.phoneNumber);
  }, [hotelData]);
  return (
    <div>
      <Dialog open={open}>
        <DialogContent className="max-w-[626px] w-full">
          <form data-cy="Update-Hotel-General-Info-Page" onSubmit={formik.handleSubmit} className="text-[#09090B]">
            <div className="pb-6 text-base">General Info</div>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2 text-sm">
                <div>Name</div>
                <div>
                  <Input data-cy="Hotel-Name-Input" value={formik.values.hotelName} onChange={formik.handleChange} id="hotelName" />
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
                </div>
              </div>
              <div className="flex flex-col gap-2 text-sm">
                <div>Phone Number</div>
                <div>
                  <Input data-cy="PhoneNumber-Input" value={formik.values.phoneNumber === 0 ? '' : formik.values.phoneNumber} onChange={formik.handleChange} id="phoneNumber" />
                </div>
              </div>
              <div className="flex flex-col gap-2 text-sm">
                <div>Rating</div>
                <div>
                  <SelectHotelReviewRating value={formik.values.rating} setFieldValue={formik.setFieldValue} />
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <div>
                <Button type="button" data-cy="Cancel-Button" onClick={() => setOpen(false)} className="bg-[#FFFFFF] border hover:bg-slate-100 active:bg-slate-200 text-black">
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
export default UpdateHotelGeneralInfo;
