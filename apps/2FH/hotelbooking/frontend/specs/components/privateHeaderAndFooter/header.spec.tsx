import { Header } from '@/components/privateHeaderAndFooter/Header';
import { render } from '@testing-library/react';

describe('Should Render Header component', () => {
  it('1. Should render Header', async () => {
    const { getByTestId } = render(<Header />);

    const headerContainer = getByTestId('Header-Container');
    expect(headerContainer);
  });
});
