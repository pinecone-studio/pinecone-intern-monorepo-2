import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { BedNumberField } from '../../../src/components/room/GeneralFormFields';

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

describe('BedNumberField', () => {
  const bedNumberProps = {
    formData: { name: '', type: [], pricePerNight: '', roomInformation: [], bedNumber: 2 },
    errors: {},
    onInputChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render bed number field with correct label', () => {
    render(<BedNumberField {...bedNumberProps} />);
    expect(screen.getByLabelText('Bed number')).toBeInTheDocument();
  });

  it('should display current bed number value', () => {
    render(<BedNumberField {...bedNumberProps} />);
    const input = screen.getByLabelText('Bed number');
    expect(input).toHaveValue(2);
  });

  it('should handle null/undefined bed number value', () => {
    const propsWithNullBedNumber = {
      ...bedNumberProps,
      formData: { ...bedNumberProps.formData, bedNumber: null as any },
    };
    render(<BedNumberField {...propsWithNullBedNumber} />);
    const input = screen.getByLabelText('Bed number');
    expect(input).toHaveValue(null);
  });

  it('should test error display functionality', () => {
    const propsWithError = {
      ...bedNumberProps,
      errors: { bedNumber: 'Bed number is required' },
    };
    render(<BedNumberField {...propsWithError} />);
    expect(screen.getByText('Bed number is required')).toBeInTheDocument();
    const input = screen.getByLabelText('Bed number');
    expect(input).toHaveClass('border-red-300', 'focus:ring-red-500');
  });

  it('should test normal styling without errors', () => {
    render(<BedNumberField {...bedNumberProps} />);
    const input = screen.getByLabelText('Bed number');
    expect(input).toHaveClass('border-gray-300', 'focus:ring-blue-500');
  });

  it('should test input attributes', () => {
    render(<BedNumberField {...bedNumberProps} />);
    const input = screen.getByLabelText('Bed number');
    expect(input).toHaveAttribute('type', 'number');
    expect(input).toHaveAttribute('min', '0');
    expect(input).toHaveAttribute('step', '1');
    expect(input).toHaveAttribute('placeholder', '1');
  });

  it('should test onChange handler', () => {
    const mockOnInputChange = jest.fn();
    render(<BedNumberField {...bedNumberProps} onInputChange={mockOnInputChange} />);
    const input = screen.getByLabelText('Bed number');
    fireEvent.change(input, { target: { value: '3' } });
    expect(mockOnInputChange).toHaveBeenCalledWith('bedNumber', '3');
  });

  it('should handle zero bed number value', () => {
    const propsWithZeroBedNumber = {
      ...bedNumberProps,
      formData: { ...bedNumberProps.formData, bedNumber: 0 },
    };
    render(<BedNumberField {...propsWithZeroBedNumber} />);
    const input = screen.getByLabelText('Bed number');
    expect(input).toHaveValue(0);
  });

  it('should handle large bed number values', () => {
    const propsWithLargeBedNumber = {
      ...bedNumberProps,
      formData: { ...bedNumberProps.formData, bedNumber: 10 },
    };
    render(<BedNumberField {...propsWithLargeBedNumber} />);
    const input = screen.getByLabelText('Bed number');
    expect(input).toHaveValue(10);
  });
});
