import { render, screen } from '@testing-library/react';
import { HeroBanner } from '@/components/landing-page/HeroBanner';

// Mock DatePicker component
jest.mock('@/components/date/Date', () => ({
  DatePicker: () => <div data-testid="date-picker">Date Picker Mock</div>,
}));

describe('HeroBanner', () => {
  it('renders without crashing', () => {
    render(<HeroBanner />);
    expect(screen.getByText('Find the Best Hotel for Your Stay')).toBeInTheDocument();
  });

  it('displays the main heading', () => {
    render(<HeroBanner />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Find the Best Hotel for Your Stay');
  });

  it('displays the subtitle text', () => {
    render(<HeroBanner />);
    expect(screen.getByText('Book from a wide selection of hotels for your next trip.')).toBeInTheDocument();
  });

  it('has correct styling classes', () => {
    render(<HeroBanner />);
    // Find the main container div that has the background color
    const container = screen.getByText('Find the Best Hotel for Your Stay').closest('div');
    const mainContainer = container?.parentElement;
    expect(mainContainer).toHaveClass('bg-[#013B94]');
    expect(mainContainer).toHaveClass('pt-10');
    expect(mainContainer).toHaveClass('pb-40');
    expect(mainContainer).toHaveClass('px-8');
  });

  it('has responsive max width container', () => {
    render(<HeroBanner />);
    const maxWidthContainer = screen.getByText('Find the Best Hotel for Your Stay').closest('.max-w-4xl');
    expect(maxWidthContainer).toBeInTheDocument();
  });

  it('renders with correct text styling', () => {
    render(<HeroBanner />);
    const heading = screen.getByRole('heading', { level: 1 });
    const subtitle = screen.getByText('Book from a wide selection of hotels for your next trip.');

    expect(heading).toHaveClass('text-5xl', 'font-bold', 'text-white', 'mb-6');
    expect(subtitle).toHaveClass('text-xl', 'text-white');
  });

  it('maintains proper spacing and layout', () => {
    render(<HeroBanner />);
    const mainContainer = screen.getByText('Find the Best Hotel for Your Stay').closest('.relative');
    expect(mainContainer).toHaveClass('w-full');
  });
});
