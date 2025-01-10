import { Cards, Countries, RatingStars, ReviewRating, RoomTypes } from '@/components/StarsStaticJson';

describe('static stars', () => {
  it('Rating stars', () => {
    expect(RatingStars).toHaveLength(5);
  });
  it('Review rating stars', () => {
    expect(ReviewRating).toHaveLength(10);
  });
  it('payment card image', () => {
    expect(Cards).toHaveLength(4);
  });
  it('payment Countries', () => {
    expect(Countries).toHaveLength(3);
  });
  it('Room general info types', () => {
    expect(RoomTypes).toHaveLength(2);
  });
});
