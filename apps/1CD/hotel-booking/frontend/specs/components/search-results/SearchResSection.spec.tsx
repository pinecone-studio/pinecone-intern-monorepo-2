import { SearchResult } from '@/components/search-hotel/SearchResult';
import { act, fireEvent, render } from '@testing-library/react';

describe('Search result section', () => {
  it('Should render', async () => {
    const { getByTestId } = render(<SearchResult />);
    const searchInput = getByTestId('search-hotel-by-name-input');
    const select = getByTestId('filter-select');

    act(() => {
      fireEvent.change(searchInput, { target: { value: 'Hotel name' } });
      fireEvent.mouseDown(select);
    });
  });
});
