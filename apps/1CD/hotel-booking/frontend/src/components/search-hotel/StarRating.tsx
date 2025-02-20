import { Checkbox } from '@/components/ui/checkbox';
import { Star } from 'lucide-react';
interface StarRatingCheckboxProps {
  stars: number;
  setStarRating: (_value: number) => void;
  starRating: number;
  index: number;
}

const StarRatingCheckbox: React.FC<StarRatingCheckboxProps> = ({ stars, index, setStarRating, starRating }) => {
  const starsNumber = () => {
    if (starRating == stars) {
      setStarRating(0);
    } else {
      setStarRating(stars);
    }
  };
  return (
    <div className="flex items-center space-x-2">
      <Checkbox data-testid={`Stars-Checkbox${index}`} onClick={starsNumber} checked={starRating == stars} id="terms2" className="rounded-xl" />
      <label htmlFor="terms2" className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        <p>{stars}</p>
        <Star size={16} />
      </label>
    </div>
  );
};
export default StarRatingCheckbox;
