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

describe('RoomServiceModal Basic Checkbox Interactions', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockValidateForm.mockReturnValue(true);
    mockValidateField.mockReturnValue(null);
  });

  it('should handle checkbox selection', () => {
    render(<RoomServiceModal isOpen={true} onClose={mockOnClose} />);

    const privateBathroomCheckbox = screen.getByLabelText('Private Bathroom');
    const tvCheckbox = screen.getByLabelText('TV');

    expect(privateBathroomCheckbox).not.toBeChecked();
    expect(tvCheckbox).not.toBeChecked();

    fireEvent.click(privateBathroomCheckbox);
    fireEvent.click(tvCheckbox);

    expect(privateBathroomCheckbox).toBeChecked();
    expect(tvCheckbox).toBeChecked();
  });

  it('should handle checkbox deselection', () => {
    render(<RoomServiceModal isOpen={true} onClose={mockOnClose} />);

    const privateBathroomCheckbox = screen.getByLabelText('Private Bathroom');

    fireEvent.click(privateBathroomCheckbox);
    expect(privateBathroomCheckbox).toBeChecked();

    fireEvent.click(privateBathroomCheckbox);
    expect(privateBathroomCheckbox).not.toBeChecked();
  });

  it('should handle multiple checkbox selections in different groups', () => {
    render(<RoomServiceModal isOpen={true} onClose={mockOnClose} />);

    const privateBathroomCheckbox = screen.getByLabelText('Private Bathroom');
    const tvCheckbox = screen.getByLabelText('TV');
    const wifiCheckbox = screen.getByLabelText('WiFi');

    fireEvent.click(privateBathroomCheckbox);
    fireEvent.click(tvCheckbox);
    fireEvent.click(wifiCheckbox);

    expect(privateBathroomCheckbox).toBeChecked();
    expect(tvCheckbox).toBeChecked();
    expect(wifiCheckbox).toBeChecked();
  });

  it('should handle validation with errors to cover line 45', () => {
    mockValidateField.mockImplementation((field) => {
      if (field === 'bathroom') {
        return 'Bathroom is required';
      }
      return null;
    });

    render(<RoomServiceModal isOpen={true} onClose={mockOnClose} />);

    const privateBathroomCheckbox = screen.getByLabelText('Private Bathroom');

    fireEvent.click(privateBathroomCheckbox);

    expect(mockValidateField).toHaveBeenCalled();
  });

  it('should handle field validation on input change', () => {
    mockValidateField.mockReturnValue('Field is required');

    render(<RoomServiceModal isOpen={true} onClose={mockOnClose} />);

    const privateBathroomCheckbox = screen.getByLabelText('Private Bathroom');
    fireEvent.click(privateBathroomCheckbox);

    expect(mockValidateField).toHaveBeenCalled();
    expect(mockSetErrors).toHaveBeenCalled();
  });
});
