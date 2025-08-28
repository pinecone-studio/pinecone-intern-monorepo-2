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

describe('RoomServiceModal Advanced Validation', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockValidateForm.mockReturnValue(true);
    mockValidateField.mockReturnValue(null);
  });

  it('should validate all form fields when input changes', () => {
    mockValidateField
      .mockReturnValueOnce('Bathroom error')
      .mockReturnValueOnce('Accessibility error')
      .mockReturnValueOnce(null)
      .mockReturnValueOnce(null)
      .mockReturnValueOnce(null)
      .mockReturnValueOnce(null)
      .mockReturnValueOnce(null);

    render(<RoomServiceModal isOpen={true} onClose={mockOnClose} />);

    const privateBathroomCheckbox = screen.getByLabelText('Private Bathroom');
    fireEvent.click(privateBathroomCheckbox);

    expect(mockValidateField).toHaveBeenCalledTimes(7);
    expect(mockSetErrors).toHaveBeenCalledWith({
      bathroom: 'Bathroom error',
      accessibility: 'Accessibility error',
    });
  });

  it('should handle validation with no errors', () => {
    mockValidateField.mockReturnValue(null);

    render(<RoomServiceModal isOpen={true} onClose={mockOnClose} />);

    const privateBathroomCheckbox = screen.getByLabelText('Private Bathroom');
    fireEvent.click(privateBathroomCheckbox);

    expect(mockValidateField).toHaveBeenCalledTimes(7);
    expect(mockSetErrors).toHaveBeenCalledWith({});
  });

  it('should handle validation with multiple field errors', () => {
    mockValidateField
      .mockReturnValueOnce('Bathroom error')
      .mockReturnValueOnce(null)
      .mockReturnValueOnce('Entertainment error')
      .mockReturnValueOnce(null)
      .mockReturnValueOnce('Other error')
      .mockReturnValueOnce(null)
      .mockReturnValueOnce(null);

    render(<RoomServiceModal isOpen={true} onClose={mockOnClose} />);

    const privateBathroomCheckbox = screen.getByLabelText('Private Bathroom');
    fireEvent.click(privateBathroomCheckbox);

    expect(mockValidateField).toHaveBeenCalledTimes(7);
    expect(mockSetErrors).toHaveBeenCalledWith({
      bathroom: 'Bathroom error',
      entertainment: 'Entertainment error',
      other: 'Other error',
    });
  });
});
