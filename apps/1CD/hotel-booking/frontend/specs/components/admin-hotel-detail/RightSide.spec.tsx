import RightSide from '@/components/admin-hotel-detail/RightSide';
import { Hotel } from '@/generated';
import { fireEvent, render } from '@testing-library/react';

describe('admin hotel detail right side test', () => {
  const hotel: Hotel = {
    _id: '1',
    description: 'test',
    images: ['/'],
  };
  it('1. it should render ', () => {
    const { getByTestId } = render(<RightSide setIsOpenLocationDialog={jest.fn()} setIsOpenImageDialog={jest.fn()} hotel={hotel} />);
    fireEvent.click(getByTestId('Location-Dialog-Open-Button'));
    fireEvent.click(getByTestId('Location-Dialog-Close-Button'));
  });
  it('2. it should render with image is empty', () => {
    render(<RightSide setIsOpenLocationDialog={jest.fn()} setIsOpenImageDialog={jest.fn()} hotel={{ images: [''] }} />);
  });
});
