import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { RoomServiceModal } from '../../../src/components/room/Roomservicemodal';
import { useRoomServiceValidation } from '../../../src/components/room/useRoomServiceValidation';

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

jest.mock('../../../src/components/room/useRoomServiceValidation', () => ({
  useRoomServiceValidation: jest.fn(),
}));

describe('RoomServiceModal Validation Scenarios', () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRoomServiceValidation as jest.Mock).mockReturnValue({
      errors: {},
      validateForm: jest.fn().mockReturnValue(true),
      validateField: jest.fn().mockReturnValue(null),
      setErrors: jest.fn(),
    });
  });

  it('should handle save with validation failure', () => {
    const mockValidateFormFalse = jest.fn().mockReturnValue(false);

    (useRoomServiceValidation as jest.Mock).mockReturnValueOnce({
      errors: {},
      validateForm: mockValidateFormFalse,
      validateField: jest.fn().mockReturnValue(null),
      setErrors: jest.fn(),
    });

    render(<RoomServiceModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} />);

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    expect(mockValidateFormFalse).toHaveBeenCalled();
    expect(mockOnSave).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should handle save with validation success', () => {
    const mockValidateFormTrue = jest.fn().mockReturnValue(true);

    (useRoomServiceValidation as jest.Mock).mockReturnValueOnce({
      errors: {},
      validateForm: mockValidateFormTrue,
      validateField: jest.fn().mockReturnValue(null),
      setErrors: jest.fn(),
    });

    render(<RoomServiceModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} />);

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    expect(mockValidateFormTrue).toHaveBeenCalled();
    expect(mockOnSave).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should handle optional onSave prop', () => {
    const mockValidateFormTrue = jest.fn().mockReturnValue(true);

    (useRoomServiceValidation as jest.Mock).mockReturnValueOnce({
      errors: {},
      validateForm: mockValidateFormTrue,
      validateField: jest.fn().mockReturnValue(null),
      setErrors: jest.fn(),
    });

    render(<RoomServiceModal isOpen={true} onClose={mockOnClose} />);

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    expect(mockValidateFormTrue).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });
});
