import { PriceDetail } from '@/components/hoteldetail/PriceDetail';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock the Dialog components to avoid portal issues
jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open }: { children: React.ReactNode; open: boolean }) => (open ? <div data-testid="price-detail">{children}</div> : null),
  DialogContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTitle: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
  DialogDescription: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Mock ReserveButton component to avoid useRouter issues
jest.mock('@/components/hoteldetail/ReserveButton', () => ({
  ReserveButton: ({ roomId }: { roomId: string }) => <button data-testid={`reserve-button-${roomId}`}>Reserve</button>,
}));

describe('PriceDetail', () => {
  it('should render dialog content when open is true', () => {
    const mockOnOpenChange = jest.fn();
    render(<PriceDetail open={true} onOpenChange={mockOnOpenChange} />);

    // Dialog should be visible
    expect(screen.getByTestId('price-detail')).toBeInTheDocument();

    // Dialog title should be visible
    expect(screen.getByText('Price Detail')).toBeInTheDocument();

    // Price information should be visible
    expect(screen.getByText('2 night')).toBeInTheDocument();
    expect(screen.getByText('₮75,000 per night')).toBeInTheDocument();
    expect(screen.getByText('₮150,000')).toBeInTheDocument();

    // Total price should be visible
    expect(screen.getByText('Total price')).toBeInTheDocument();
    expect(screen.getByText('₮300,000')).toBeInTheDocument();
  });

  it('should not render dialog content when open is false', () => {
    const mockOnOpenChange = jest.fn();
    render(<PriceDetail open={false} onOpenChange={mockOnOpenChange} />);

    // Dialog should not be visible
    expect(screen.queryByTestId('price-detail')).not.toBeInTheDocument();
  });
});
