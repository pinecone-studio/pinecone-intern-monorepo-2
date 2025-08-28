import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { NameField, TypeField, PriceField } from '../../../src/components/room/GeneralFormFields';

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

describe('GeneralFormFields', () => {
  const defaultProps = {
    formData: { name: 'Test Room', type: ['Single'], pricePerNight: '100', roomInformation: ['FreeWifi'] },
    errors: {},
    onInputChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('NameField', () => {
    it('should test error display functionality', () => {
      const propsWithError = {
        ...defaultProps,
        errors: { name: 'Name is required' },
      };
      render(<NameField {...propsWithError} />);
      expect(screen.getByText('Name is required')).toBeInTheDocument();
      const input = screen.getByLabelText('Name');
      expect(input).toHaveClass('border-red-300', 'focus:ring-red-500');
    });

    it('should test normal styling without errors', () => {
      render(<NameField {...defaultProps} />);
      const input = screen.getByLabelText('Name');
      expect(input).toHaveClass('border-gray-300', 'focus:ring-blue-500');
    });

    it('should test onChange handler', () => {
      const mockOnInputChange = jest.fn();
      render(<NameField {...defaultProps} onInputChange={mockOnInputChange} />);
      const input = screen.getByLabelText('Name');
      fireEvent.change(input, { target: { value: 'New Room Name' } });
      expect(mockOnInputChange).toHaveBeenCalledWith('name', 'New Room Name');
    });
  });

  describe('TypeField', () => {
    it('should test error display functionality', () => {
      const propsWithError = {
        ...defaultProps,
        errors: { type: 'Type is required' },
      };
      render(<TypeField {...propsWithError} />);
      expect(screen.getByText('Type is required')).toBeInTheDocument();
      const select = screen.getByLabelText('Type');
      expect(select).toHaveClass('border-red-300', 'focus:ring-red-500');
    });

    it('should test normal styling without errors', () => {
      render(<TypeField {...defaultProps} />);
      const select = screen.getByLabelText('Type');
      expect(select).toHaveClass('border-gray-300', 'focus:ring-blue-500');
    });

    it('should test empty type array handling', () => {
      const propsWithEmptyType = {
        ...defaultProps,
        formData: { name: '', type: [], pricePerNight: '', roomInformation: [] },
      };
      render(<TypeField {...propsWithEmptyType} />);
      const select = screen.getByLabelText('Type');
      expect(select).toHaveValue('');
    });

    it('should test onChange handler', () => {
      const mockOnInputChange = jest.fn();
      render(<TypeField {...defaultProps} onInputChange={mockOnInputChange} />);
      const select = screen.getByLabelText('Type');
      fireEvent.change(select, { target: { value: 'Double' } });
      expect(mockOnInputChange).toHaveBeenCalledWith('type', ['Double']);
    });
  });

  describe('PriceField', () => {
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
      expect(input).toHaveAttribute('step', '0.01');
    });

    it('should test onChange handler', () => {
      const mockOnInputChange = jest.fn();
      render(<PriceField {...defaultProps} onInputChange={mockOnInputChange} />);
      const input = screen.getByLabelText('Price per night');
      fireEvent.change(input, { target: { value: '150' } });
      expect(mockOnInputChange).toHaveBeenCalledWith('pricePerNight', '150');
    });
  });
});
