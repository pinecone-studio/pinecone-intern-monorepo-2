import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import * as yup from 'yup';
import { useFormik } from 'formik';

import SelectRoomTypes from '@/components/SelectRoomTypes';
import { useAddRoomMutation } from '@/generated';

type AddHotelGeneralInfoType = {
  open: boolean;
  setOpen: (_: boolean) => void;
};
const AddRoomGeneralInfo = ({ open, setOpen }: AddHotelGeneralInfoType) => {
  const [addRoomGeneralInfo] = useAddRoomMutation();
  const PricePerNight = () => {
    if (formik.errors.pricePerNight && formik.touched.pricePerNight)
      return (
        <p data-cy="Price-Per-Night-Error" className="text-red-500">
          {formik.errors.pricePerNight}
        </p>
      );
  };

  const RoomType = () => {
    if (formik.errors.roomType && formik.touched.roomType)
      return (
        <p data-cy="Room-Type-Error" className="text-red-500">
          {formik.errors.roomType}
        </p>
      );
  };

  const RoomName = () => {
    if (formik.errors.roomName && formik.touched.roomName)
      return (
        <p data-cy="Room-Name-Error" className="text-red-500">
          {formik.errors.roomName}
        </p>
      );
  };
  const initialValues = {
    roomName: '',
    roomInformation: [],
    roomType: '',
    pricePerNight: 0,
  };
  const validationSchema = yup.object({
    roomName: yup.string().required('room name is required'),
    roomInformation: yup.array(),
    roomType: yup.string().required('room type is required'),
    pricePerNight: yup.number().min(1, 'room price per night is required'),
  });
  const formik = useFormik({
    initialValues,
    onSubmit: async (values, { resetForm }) => {
      await addRoomGeneralInfo({
        variables: {
          input: {
            hotelId: '674bfbd6a111c70660b55541',
            roomName: values.roomName,
            roomInformation: values.roomInformation,
            price: Number(values.pricePerNight),
            roomType: values.roomType,
          },
        },
      });
      resetForm();

      setOpen(false);
    },
    validationSchema,
  });
  return (
    <div>
      <Dialog open={open}>
        <DialogContent className="max-w-[626px] w-full">
          <form data-cy="Room-General-Info-Page" onSubmit={formik.handleSubmit} className="text-[#09090B]">
            <div className="pb-6 text-base">General Info</div>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2 text-sm">
                <div>Name</div>
                <div>
                  <Input data-cy="Room-Name-Input" value={formik.values.roomName} onChange={formik.handleChange} id="roomName" />
                  <RoomName />
                </div>
              </div>
              <div className="flex flex-col gap-2 text-sm">
                <div>Type</div>
                <div>
                  <SelectRoomTypes setFieldValue={formik.setFieldValue} />
                  <RoomType />
                </div>
              </div>
              <div className="flex flex-col gap-2 text-sm">
                <div>Price per night</div>
                <div>
                  <Input data-cy="Price-Per-Night-Input" value={formik.values.pricePerNight === 0 ? '' : formik.values.pricePerNight} onChange={formik.handleChange} id="pricePerNight" />
                  <PricePerNight />
                </div>
              </div>
              <div className="flex flex-col gap-2 text-sm">
                <div>Room information</div>
                <div>
                  <Textarea maxLength={100} value={formik.values.roomInformation} onChange={formik.handleChange} id="roomInformation" />
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <div>
                <Button data-cy="Room-Cancel-Button" onClick={() => setOpen(false)} className="bg-[#FFFFFF] hover:bg-slate-100 active:bg-slate-200 text-black">
                  Cancel
                </Button>
              </div>
              <div>
                <Button type="submit" data-cy="Room-Save-Button" className="text-white bg-[#2563EB] hover:bg-blue-400 active:bg-blue-300">
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
export default AddRoomGeneralInfo;
