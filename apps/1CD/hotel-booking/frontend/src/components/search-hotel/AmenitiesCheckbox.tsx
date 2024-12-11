import { Checkbox } from '@/components/ui/checkbox';
interface AmenitiesCheckboxProps {
  amenities: string;
}

const AmenitiesCheckbox: React.FC<AmenitiesCheckboxProps> = ({ amenities }) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms2" />
      <label htmlFor="terms2" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {amenities}
      </label>
    </div>
  );
};
export default AmenitiesCheckbox;
