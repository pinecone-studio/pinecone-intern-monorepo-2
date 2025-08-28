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

describe('RoomServiceModal Save Actions', () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockValidateForm.mockReturnValue(true);
    mockValidateField.mockReturnValue(null);
  });

  it('should call onSave and onClose when Save button is clicked with valid data', () => {
    render(<RoomServiceModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} />);

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledWith({
      bathroom: [],
      accessibility: [],
      entertainment: [],
      foodAndDrink: [],
      other: [],
      internet: [],
      bedRoom: [],
    });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should not call onSave when validation fails', () => {
    mockValidateForm.mockReturnValue(false);

    render(<RoomServiceModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} />);

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    expect(mockValidateForm).toHaveBeenCalled();
    expect(mockOnSave).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should handle onSave being undefined', () => {
    render(<RoomServiceModal isOpen={true} onClose={mockOnClose} />);

    const saveButton = screen.getByText('Save');

    expect(() => fireEvent.click(saveButton)).not.toThrow();
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should handle onSave being undefined with validation passing', () => {
    mockValidateForm.mockReturnValue(true);

    render(<RoomServiceModal isOpen={true} onClose={mockOnClose} />);

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    expect(mockValidateForm).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
