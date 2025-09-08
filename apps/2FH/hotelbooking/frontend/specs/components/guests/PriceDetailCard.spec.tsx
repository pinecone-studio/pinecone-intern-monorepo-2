import React from 'react';
import { render, screen } from '@testing-library/react';
import PriceDetailCard from '@/components/guests/PriceDetailCard';
describe('PriceDetailCard', () => {
  const mockRoom = {
    pricePerNight: 150000,
  };
  const defaultProps = {
    room: mockRoom,
  };
  it('renders price detail card correctly', () => {
    render(<PriceDetailCard {...defaultProps} />);
    expect(screen.getByText('Price Detail')).toBeInTheDocument();
    expect(screen.getByText('1 night')).toBeInTheDocument();
    expect(screen.getByText('150,000₮ per night')).toBeInTheDocument();
    expect(screen.getByText('150,000₮')).toBeInTheDocument();
  });
  it('calculates tax correctly', () => {
    render(<PriceDetailCard {...defaultProps} />);
    expect(screen.getByText('12,000₮')).toBeInTheDocument();
  });
  it('calculates total price correctly', () => {
    render(<PriceDetailCard {...defaultProps} />);
    expect(screen.getByText('162,000₮')).toBeInTheDocument();
  });
  it('displays tax section', () => {
    render(<PriceDetailCard {...defaultProps} />);
    expect(screen.getByText('Taxes')).toBeInTheDocument();
  });
  it('displays total price section', () => {
    render(<PriceDetailCard {...defaultProps} />);
    expect(screen.getByText('Total price')).toBeInTheDocument();
  });
  it('handles room with no price', () => {
    const roomWithNoPrice = {};
    render(<PriceDetailCard room={roomWithNoPrice} />);
    expect(screen.getByText('150,000₮ per night')).toBeInTheDocument();
    expect(screen.getByText('150,000₮')).toBeInTheDocument();
  });
  it('handles room with null price', () => {
    const roomWithNullPrice = { pricePerNight: null };
    render(<PriceDetailCard room={roomWithNullPrice} />);
    expect(screen.getByText('150,000₮ per night')).toBeInTheDocument();
  });
  it('handles room with undefined price', () => {
    const roomWithUndefinedPrice = { pricePerNight: undefined };
    render(<PriceDetailCard room={roomWithUndefinedPrice} />);
    expect(screen.getByText('150,000₮ per night')).toBeInTheDocument();
  });
  it('handles room with zero price', () => {
    const roomWithZeroPrice = { pricePerNight: 0 };
    render(<PriceDetailCard room={roomWithZeroPrice} />);
    expect(screen.getByText('0₮ per night')).toBeInTheDocument();
    const zeroElements = screen.getAllByText('0₮');
    expect(zeroElements.length).toBeGreaterThanOrEqual(3); // Should have at least 3 zero amounts
  });
  it('handles room with negative price', () => {
    const roomWithNegativePrice = { pricePerNight: -1000 };
    render(<PriceDetailCard room={roomWithNegativePrice} />);
    expect(screen.getByText('-1,000₮ per night')).toBeInTheDocument();
    expect(screen.getByText('-1,000₮')).toBeInTheDocument();
    expect(screen.getByText('-80₮')).toBeInTheDocument(); // Tax
    expect(screen.getByText('-1,080₮')).toBeInTheDocument(); // Total
  });
  it('handles room with decimal price', () => {
    const roomWithDecimalPrice = { pricePerNight: 150000.5 };
    render(<PriceDetailCard room={roomWithDecimalPrice} />);
    expect(screen.getByText('150,000.5₮ per night')).toBeInTheDocument();
    expect(screen.getByText('150,000.5₮')).toBeInTheDocument();
  });
  it('handles room with very large price', () => {
    const roomWithLargePrice = { pricePerNight: 1000000 };
    render(<PriceDetailCard room={roomWithLargePrice} />);
    expect(screen.getByText('1,000,000₮ per night')).toBeInTheDocument();
    expect(screen.getByText('1,000,000₮')).toBeInTheDocument();
    expect(screen.getByText('80,000₮')).toBeInTheDocument(); // Tax
    expect(screen.getByText('1,080,000₮')).toBeInTheDocument(); // Total
  });
  it('formats numbers with proper locale formatting', () => {
    const roomWithLargePrice = { pricePerNight: 1234567 };
    render(<PriceDetailCard room={roomWithLargePrice} />);
    expect(screen.getByText('1,234,567₮ per night')).toBeInTheDocument();
    expect(screen.getByText('1,234,567₮')).toBeInTheDocument();
    expect(screen.getByText('98,765₮')).toBeInTheDocument(); // Tax (rounded)
    expect(screen.getByText('1,333,332₮')).toBeInTheDocument(); // Total
  });
  it('renders with proper card structure', () => {
    render(<PriceDetailCard {...defaultProps} />);
    const card = document.querySelector('.rounded-lg.border');
    expect(card).toBeInTheDocument();
  });
  it('renders with proper spacing', () => {
    render(<PriceDetailCard {...defaultProps} />);
    const spaceYContainer = document.querySelector('.space-y-3');
    expect(spaceYContainer).toBeInTheDocument();
  });
  it('renders with proper border styling', () => {
    render(<PriceDetailCard {...defaultProps} />);
    const borderContainer = document.querySelector('.border-t.pt-3');
    expect(borderContainer).toBeInTheDocument();
  });
  it('displays proper font weights', () => {
    render(<PriceDetailCard {...defaultProps} />);
    const totalPriceElement = screen.getByText('162,000₮');
    expect(totalPriceElement).toHaveClass('font-bold');
    const totalPriceLabel = screen.getByText('Total price');
    expect(totalPriceLabel).toHaveClass('font-semibold');
  });
  it('handles room with string price', () => {
    const roomWithStringPrice = { pricePerNight: '150000' as any };
    render(<PriceDetailCard room={roomWithStringPrice} />);
    expect(screen.getByText('150,000₮ per night')).toBeInTheDocument();
  });

  it('handles room with invalid price', () => {
    const roomWithInvalidPrice = { pricePerNight: 'invalid' as any };
    render(<PriceDetailCard room={roomWithInvalidPrice} />);

    // Should use default price when invalid
    expect(screen.getByText('150,000₮ per night')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { container } = render(<PriceDetailCard {...defaultProps} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot with zero price', () => {
    const roomWithZeroPrice = { pricePerNight: 0 };
    const { container } = render(<PriceDetailCard room={roomWithZeroPrice} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot with large price', () => {
    const roomWithLargePrice = { pricePerNight: 1000000 };
    const { container } = render(<PriceDetailCard room={roomWithLargePrice} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
