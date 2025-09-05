import { HotelLoader } from '@/components/loadingComponent/Loader';
import { render, screen } from '@testing-library/react';

describe('HotelLoader', () => {
  it('renders the logo text', () => {
    render(<HotelLoader />);
    expect(screen.getByText('Pedia')).toBeInTheDocument();
  });

  it('renders the spinner', () => {
    render(<HotelLoader />);
    const spinner = screen.getByRole('status', { hidden: true });
    expect(spinner).toBeInTheDocument();
  });

  it('renders the loading text', () => {
    render(<HotelLoader />);
    expect(screen.getByText(/Please Wait.../i)).toBeInTheDocument();
  });
});
