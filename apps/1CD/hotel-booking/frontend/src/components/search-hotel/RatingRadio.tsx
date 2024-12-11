import { Checkbox } from '@/components/ui/checkbox';
interface RatingCheckboxProps {
  rating: number;
}

const RatingCheckbox: React.FC<RatingCheckboxProps> = ({ rating }) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms2" className="rounded-xl" />
      <label htmlFor="terms2" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        +{rating}
      </label>
    </div>
  );
};

export default RatingCheckbox;
