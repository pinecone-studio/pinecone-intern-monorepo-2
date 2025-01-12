import '@testing-library/jest-dom';
import { render, waitFor } from '@testing-library/react';
import { ProductsGrid } from '../../src/components';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { GetProductsDocument } from '../../src/generated';

const mock: MockedResponse = {
  request: {
    query: GetProductsDocument,
  },
  result: {
    data: {
      getProducts: [
        {
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
        },
        {
          _id: '2',
          name: 'Product 2',
          price: 200,
          images: ['https://via.placeholder.com/150'],
          category: {
            _id: '2',
            name: 'Category 2',
            createdAt: '',
            updatedAt: '',
          },
          description: '',
          createdAt: '',
          updatedAt: '',
        },
      ],
    },
  },
  delay: 200,
};

describe('ProductGrid', () => {
  it('should render successfully', async () => {
    const { getAllByTestId } = render(
      <MockedProvider mocks={[mock]}>
        <ProductsGrid />
      </MockedProvider>
    );

    await waitFor(() => {
      expect(getAllByTestId('product-card')[0]).toBeInTheDocument();
    });
  });
});
