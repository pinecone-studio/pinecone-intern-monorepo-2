import { Dialog, DialogContent } from '@/components/providers/HotelBookingDialog';
import { Button } from '@/components/ui/button';
import { MultiSelect } from '@/components/ui/multi-select';
import { Hotel, useAddAmenityMutation } from '@/generated';
import { useFormik } from 'formik';
import { useEffect } from 'react';
import * as yup from 'yup';
type Option = {
  value: string;
  label: string;
};

const amenitiesoptions = ['24-hour front desk', 'Conceirge services', 'Tour/ticket assistance', 'Dry cleaning/laundry services', 'Luggage storage', 'shower'];

const options: Option[] = amenitiesoptions.map((amenity) => {
  const object = {} as Option;
  object.value = amenity;
  object.label = amenity;
  return object;
});
const HotelAmenitiesDialog = ({
  open,
  setOpen,
  AllQueriesRefetch,
  hotelId,
  hotel,
}: {
  open: boolean;
  setOpen: (_value: boolean) => void;
  hotelId: string;
  AllQueriesRefetch: () => void;
  hotel: Hotel;
}) => {
  const [updateLocation] = useAddAmenityMutation({
    onCompleted: () => AllQueriesRefetch(),
  });
  const initialValues = {
    amenities: [],
  };
  const handleAmenities = (options: Option[]) => {
    formik.setFieldValue('amenities', options);
  };
  const updateHotelAmenities = async () => {
    await updateLocation({
      variables: {
        input: {
          _id: hotelId,
          hotelAmenities: formik.values.amenities.map((amenity: Option) => amenity.label),
        },
      },
    });
    setOpen(false);
  };
  const validationSchema = yup.object({
    amenities: yup.array().min(1, 'please enter select or type value'),
  });
  const formik = useFormik({
    initialValues,
    onSubmit: async () => {
      await updateHotelAmenities();
    },
    validationSchema,
  });
  useEffect(() => {
    if (hotel.hotelAmenities?.length) {
      const array: Option[] = [];
      hotel.hotelAmenities.forEach((amenity) => {
        const object = {} as Option;
        object.value = String(amenity);
        object.label = String(amenity);
        array.push(object);
      });
      handleAmenities(array);
    }
  }, [open]);

  const ErrorMessege = () => {
    if (formik.touched.amenities && formik.errors.amenities)
      return (
        <p data-cy="Error-Message-Amenities" className="text-red-500">
          {formik.errors.amenities}
        </p>
      );
  };

  return (
    <Dialog open={open}>
      <DialogContent>
        <div className="text-[#09090B] text-foreground">Amenities</div>
        <MultiSelect placeholder="Select-Value" options={options} value={formik.values.amenities} onValueChange={handleAmenities} />
        <ErrorMessege />
        <form data-cy="Update-Amenities-Dialog" onSubmit={formik.handleSubmit} className="flex justify-between">
          <Button data-cy="Hotel-Amenities-Cancel-Button" type="button" onClick={() => setOpen(false)} className="text-black bg-white border hover:bg-slate-100 active:bg-slate-200">
            Cancel
          </Button>
          <Button data-cy="Hotel-Amenities-Update-Button" type="submit" className="bg-[#2563EB] hover:bg-blue-500 active:bg-blue-600">
            Save
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default HotelAmenitiesDialog;
