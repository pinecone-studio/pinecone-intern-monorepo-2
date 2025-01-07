import RightSide from '@/components/admin-hotel-detail/RightSide';
import { Hotel } from '@/generated';
import { render } from '@testing-library/react';

describe('admin hotel detail right side test', () => {
  const hotel: Hotel = {
    _id: '1',
    description: 'test',
    images: ['/'],
  };
  it('1. it should render ', () => {
    render(<RightSide hotel={hotel} />);
  });
  it('2. it should render with image is empty', () => {
    render(<RightSide hotel={{ images: [''] }} />);
  });
});
