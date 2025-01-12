import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { ProductGridCard } from '../../src/components';

const product = {
  _id: '1',
  name: 'Product 1',
  price: 100,
  images: ['https://via.placeholder.com/150'],
  category: {
    _id: '1',
    name: 'Category 1',
    createdAt: '',
    updatedAt: '',
  },
  description: '',
  createdAt: '',
  updatedAt: '',
};

describe('ProductGridCard', () => {
  it('should render successfully', async () => {
    render(<ProductGridCard {...product} />);
  });
});
