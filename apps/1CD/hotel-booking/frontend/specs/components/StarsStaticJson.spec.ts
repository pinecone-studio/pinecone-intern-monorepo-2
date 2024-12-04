import { RatingStars, ReviewRating } from '@/components/StarsStaticJson';

describe('static stars', () => {
  it('Rating stars', () => {
    expect(RatingStars).toHaveLength(5);
  });
  it('Review rating stars', () => {
    expect(ReviewRating).toHaveLength(10);
  });
});
