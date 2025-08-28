import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { NameField, TypeField, PriceField, RoomInformationField } from '../../../src/components/room/GeneralFormFields';

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

describe('GeneralFormFields Error Handling', () => {
  const defaultProps = {
    formData: { name: 'Test Room', type: ['Single'], pricePerNight: '100', roomInformation: ['FreeWifi'] },
    errors: {},
    onInputChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should test error handling for all fields', () => {
    const propsWithAllErrors = {
      ...defaultProps,
      errors: {
        name: 'Name is required',
        type: 'Type is required',
        pricePerNight: 'Price is required',
        roomInformation: 'Room information is required',
      },
    };
    render(<NameField {...propsWithAllErrors} />);
    expect(screen.getByText('Name is required')).toBeInTheDocument();
    render(<TypeField {...propsWithAllErrors} />);
    expect(screen.getByText('Type is required')).toBeInTheDocument();
    render(<PriceField {...propsWithAllErrors} />);
    expect(screen.getByText('Price is required')).toBeInTheDocument();
    render(<RoomInformationField {...propsWithAllErrors} />);
    expect(screen.getByText('Room information is required')).toBeInTheDocument();
  });

  it('should test error styling for all fields', () => {
    const propsWithAllErrors = {
      ...defaultProps,
      errors: {
        name: 'Name is required',
        type: 'Type is required',
        pricePerNight: 'Price is required',
        roomInformation: 'Room information is required',
      },
    };
    render(<NameField {...propsWithAllErrors} />);
    expect(screen.getByLabelText('Name')).toHaveClass('border-red-300', 'focus:ring-red-500');
    render(<TypeField {...propsWithAllErrors} />);
    expect(screen.getByLabelText('Type')).toHaveClass('border-red-300', 'focus:ring-red-500');
    render(<PriceField {...propsWithAllErrors} />);
    expect(screen.getByLabelText('Price per night')).toHaveClass('border-red-300', 'focus:ring-red-500');
    render(<RoomInformationField {...propsWithAllErrors} />);
    const container = screen.getByText('Room information').closest('div')?.querySelector('#room-information');
    expect(container).toBeTruthy();
    expect(container).toHaveClass('border-red-300');
    expect(container).toHaveClass('bg-red-50');
  });
});
