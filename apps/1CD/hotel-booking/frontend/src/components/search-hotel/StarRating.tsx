import { Checkbox } from '@/components/ui/checkbox';
interface StarRatingCheckboxProps {
  stars: number;
  setStarRating: (_value: number) => void;
  starRating: number;
}

const StarRatingCheckbox: React.FC<StarRatingCheckboxProps> = ({ stars, setStarRating, starRating }) => {
  const starsNumber = () => {
    if (starRating == stars) {
      setStarRating(0);
    } else {
      setStarRating(stars);
    }
  };
  return (
    <div className="flex items-center space-x-2">
      <Checkbox onClick={starsNumber} checked={starRating == stars} id="terms2" className="rounded-xl" />
      <label htmlFor="terms2" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {stars} stars
      </label>
    </div>
  );
};
export default StarRatingCheckbox;
