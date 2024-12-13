import { Checkbox } from '@/components/ui/checkbox';
interface AmenitiesCheckboxProps {
  amenities: string;
  hotelAmenities: string[];
  setHotelAmenities: (_value: string[]) => void;
}

const AmenitiesCheckbox: React.FC<AmenitiesCheckboxProps> = ({ amenities, hotelAmenities, setHotelAmenities }) => {
  const handleValue = () => {
    const array = [...hotelAmenities];
    setHotelAmenities(array);
    return array;
  };
  return (
    <div className="flex items-center space-x-2">
      <Checkbox onClick={() => handleValue()} id="terms2" />
      <label htmlFor="terms2" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {amenities}
      </label>
    </div>
  );
};
export default AmenitiesCheckbox;
