import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { MultiSelect } from '@/components/ui/multi-select';
import SelectRoomTypes from '@/components/SelectRoomTypes';
import { useAddRoomMutation } from '@/generated';
import { Dialog, DialogContent } from '@/components/providers/HotelBookingDialog';
type AddHotelGeneralInfoType = {
  open: boolean;
  setOpen: (_: boolean) => void;
  AllQueriesRefetch: () => void;
  hotelId: string;
};
export type Option = {
  value: string;
  label: string;
};
const options: Option[] = [
  {
    value: '24-hour front desk',
    label: '24-hour front desk',
  },
  {
    value: 'Conceirge services',
    label: 'Conceirge services',
  },
  {
    value: 'Tour/ticket assistance',
    label: 'Tour/ticket assistance',
  },
  {
    value: 'Dry cleaning/laundry services',
    label: 'Dry cleaning/laundry services',
  },
  {
    value: 'Luggage storage',
    label: 'Luggage storage',
  },
  {
    value: 'shower',
    label: 'shower',
  },
];
const AddRoomGeneralInfo = ({ open, hotelId, setOpen, AllQueriesRefetch }: AddHotelGeneralInfoType) => {
  const [addRoomGeneralInfo] = useAddRoomMutation({
    onCompleted: () => {
      AllQueriesRefetch();
    },
  });
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
  const handleValue = (options: Option[]) => {
    formik.setFieldValue('roomInformation', options);
  };
  const formik = useFormik({
    initialValues,
    onSubmit: async (values, { resetForm }) => {
      await addRoomGeneralInfo({
        variables: {
          input: {
            hotelId: hotelId,
            roomName: values.roomName,
            roomInformation: values.roomInformation.map((option: Option) => option.value),
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
    <Dialog open={open}>
      <DialogContent className="max-w-[626px] w-full bg-blue-50">
        <form data-cy="Room-General-Info-Page" onSubmit={formik.handleSubmit} className="text-[#09090B]">
          <div className="pb-6 font-semibold text-[#2563EB]">General Info</div>
          <div className="flex flex-col gap-6 bg-blue-50">
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
                <MultiSelect data-cy="Add-Room-General-Info-Multi-Select" options={options} value={formik.values.roomInformation} placeholder="Select options..." onValueChange={handleValue} />
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-6">
            <div>
              <Button data-cy="Room-Cancel-Button" onClick={() => setOpen(false)} className="bg-[#FFFFFF] border hover:bg-slate-100 active:bg-slate-200 text-black">
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
  );
};
export default AddRoomGeneralInfo;
