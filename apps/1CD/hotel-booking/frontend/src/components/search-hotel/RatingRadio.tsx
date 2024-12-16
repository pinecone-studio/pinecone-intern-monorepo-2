import { Checkbox } from '@/components/ui/checkbox';
interface RatingCheckboxProps {
  rating: number;
  userReviewRating: number;
  setUserReviewRating: (_value: number) => void;
  index: number;
}

const RatingCheckbox: React.FC<RatingCheckboxProps> = ({ rating, userReviewRating, index, setUserReviewRating }) => {
  const userReviewRatingNumber = (rating: number) => {
    if (rating == userReviewRating) {
      setUserReviewRating(0);
    } else {
      setUserReviewRating(rating);
    }
  };
  return (
    <div className="flex items-center space-x-2">
      <Checkbox data-testid={`checkbox${index}`} checked={userReviewRating == rating} onClick={() => userReviewRatingNumber(rating)} id="terms2" className="rounded-xl" />
      <label htmlFor="terms2" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        +{rating}
      </label>
    </div>
  );
};

export default RatingCheckbox;
