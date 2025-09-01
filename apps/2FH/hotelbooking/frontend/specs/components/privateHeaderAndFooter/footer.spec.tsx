import { Footer } from '@/components/privateHeaderAndFooter/Footer';
import { render } from '@testing-library/react';

describe('It should render Footer', () => {
  it('1. should render footer component', async () => {
    const { getByTestId } = render(<Footer />);
    const footerContainer = getByTestId('Footer-Container');

    expect(footerContainer);
  });
});
