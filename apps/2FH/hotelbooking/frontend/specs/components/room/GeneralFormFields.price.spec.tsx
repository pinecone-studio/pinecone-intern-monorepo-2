import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { PriceField } from '../../../src/components/room/GeneralFormFields';

jest.mock('@/generated', () => ({
  TypePerson: {
    Single: 'Single',
    Double: 'Double',
    Triple: 'Triple',
    Quad: 'Quad',
    Queen: 'Queen',
    King: 'King',
  },
  RoomInformation: {
    PrivateBathroom: 'PrivateBathroom',
    SharedBathroom: 'SharedBathroom',
    FreeBottleWater: 'FreeBottleWater',
    AirConditioner: 'AirConditioner',
    Tv: 'Tv',
    Minibar: 'Minibar',
    FreeWifi: 'FreeWifi',
    FreeParking: 'FreeParking',
    Shower: 'Shower',
    Bathtub: 'Bathtub',
    HairDryer: 'HairDryer',
    Desk: 'Desk',
    Elevator: 'Elevator',
  },
}));

describe('PriceField', () => {
  const defaultProps = {
    formData: { name: 'Test Room', type: ['Single'], pricePerNight: '100', roomInformation: ['FreeWifi'], bedNumber: 1 },
    errors: {},
    onInputChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should test error display functionality', () => {
    const propsWithError = {
      ...defaultProps,
      errors: { pricePerNight: 'Price is required' },
    };
    render(<PriceField {...propsWithError} />);
    expect(screen.getByText('Price is required')).toBeInTheDocument();
    const input = screen.getByLabelText('Price per night');
    expect(input).toHaveClass('border-red-300', 'focus:ring-red-500');
  });

  it('should test normal styling without errors', () => {
    render(<PriceField {...defaultProps} />);
    const input = screen.getByLabelText('Price per night');
    expect(input).toHaveClass('border-gray-300', 'focus:ring-blue-500');
  });

  it('should test input attributes', () => {
    render(<PriceField {...defaultProps} />);
    const input = screen.getByLabelText('Price per night');
    expect(input).toHaveAttribute('type', 'number');
    expect(input).toHaveAttribute('min', '0');
    expect(input).toHaveAttribute('step', '100');
  });

  it('should test onChange handler', () => {
    const mockOnInputChange = jest.fn();
    render(<PriceField {...defaultProps} onInputChange={mockOnInputChange} />);
    const input = screen.getByLabelText('Price per night');
    fireEvent.change(input, { target: { value: '150' } });
    expect(mockOnInputChange).toHaveBeenCalledWith('pricePerNight', '150');
  });

  it('should display current price value', () => {
    render(<PriceField {...defaultProps} />);
    const input = screen.getByLabelText('Price per night');
    expect(input).toHaveValue(100);
  });

  it('should render with correct placeholder', () => {
    render(<PriceField {...defaultProps} />);
    const input = screen.getByLabelText('Price per night');
    expect(input).toHaveAttribute('placeholder', 'Enter price');
  });

  it('should handle decimal price values', () => {
    const mockOnInputChange = jest.fn();
    render(<PriceField {...defaultProps} onInputChange={mockOnInputChange} />);
    const input = screen.getByLabelText('Price per night');
    fireEvent.change(input, { target: { value: '150.50' } });
    expect(mockOnInputChange).toHaveBeenCalledWith('pricePerNight', '150.50');
  });
});
