import { Checkbox } from '@/components/ui/checkbox';
interface StarRatingCheckboxProps {
  stars: number;
}

const StarRatingCheckbox: React.FC<StarRatingCheckboxProps> = ({ stars }) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms2" className="rounded-xl" />
      <label htmlFor="terms2" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {stars} stars
      </label>
    </div>
  );
};
export default StarRatingCheckbox;
