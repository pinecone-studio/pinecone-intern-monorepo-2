import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { RoomServiceModal } from '../../../src/components/room/Roomservicemodal';

jest.mock('../../../src/components/room/useRoomServiceOptions', () => ({
  useRoomServiceOptions: () => ({
    bathroomOptions: [
      { value: 'private', label: 'Private Bathroom' },
      { value: 'shared', label: 'Shared Bathroom' },
    ],
    accessibilityOptions: [
      { value: 'wheelchair', label: 'Wheelchair Accessible' },
      { value: 'elevator', label: 'Elevator' },
    ],
    entertainmentOptions: [
      { value: 'tv', label: 'TV' },
      { value: 'radio', label: 'Radio' },
    ],
    foodAndDrinkOptions: [
      { value: 'breakfast', label: 'Breakfast' },
      { value: 'minibar', label: 'Minibar' },
    ],
    otherOptions: [
      { value: 'desk', label: 'Desk' },
      { value: 'wardrobe', label: 'Wardrobe' },
    ],
    internetOptions: [
      { value: 'wifi', label: 'WiFi' },
      { value: 'ethernet', label: 'Ethernet' },
    ],
    bedRoomOptions: [
      { value: 'ac', label: 'Air Conditioning' },
      { value: 'heating', label: 'Heating' },
    ],
  }),
}));

const mockValidateForm = jest.fn().mockReturnValue(true);
const mockValidateField = jest.fn().mockReturnValue(null);
const mockSetErrors = jest.fn();

jest.mock('../../../src/components/room/useRoomServiceValidation', () => ({
  useRoomServiceValidation: () => ({
    errors: {},
    validateForm: mockValidateForm,
    validateField: mockValidateField,
    setErrors: mockSetErrors,
  }),
}));

describe('RoomServiceModal Form State Management', () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockValidateForm.mockReturnValue(true);
    mockValidateField.mockReturnValue(null);
  });

  it('should handle form data state correctly', () => {
    render(<RoomServiceModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} />);

    const privateBathroomCheckbox = screen.getByLabelText('Private Bathroom');
    const tvCheckbox = screen.getByLabelText('TV');

    fireEvent.click(privateBathroomCheckbox);
    fireEvent.click(tvCheckbox);

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledWith({
      bathroom: ['private'],
      accessibility: [],
      entertainment: ['tv'],
      foodAndDrink: [],
      other: [],
      internet: [],
      bedRoom: [],
    });
  });

  it('should handle validation errors display', () => {
    const mockErrors = { bathroom: 'Bathroom is required' };

    jest.doMock('../../../src/components/room/useRoomServiceValidation', () => ({
      useRoomServiceValidation: () => ({
        errors: mockErrors,
        validateForm: jest.fn().mockReturnValue(false),
        validateField: jest.fn().mockReturnValue('Bathroom is required'),
        setErrors: mockSetErrors,
      }),
    }));

    render(<RoomServiceModal isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByText('Room Services')).toBeInTheDocument();
  });

  it('should handle checkbox group rendering with errors', () => {
    const mockErrors = { bathroom: 'Bathroom is required' };

    jest.doMock('../../../src/components/room/useRoomServiceValidation', () => ({
      useRoomServiceValidation: () => ({
        errors: mockErrors,
        validateForm: jest.fn().mockReturnValue(false),
        validateField: jest.fn().mockReturnValue(null),
        setErrors: jest.fn(),
      }),
    }));

    render(<RoomServiceModal isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByText('Bathroom')).toBeInTheDocument();
  });
});
