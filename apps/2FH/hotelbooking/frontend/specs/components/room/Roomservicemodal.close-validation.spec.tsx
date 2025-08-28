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

describe('RoomServiceModal Close Actions & Validation', () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockValidateForm.mockReturnValue(true);
    mockValidateField.mockReturnValue(null);
  });

  it('should call onClose when Cancel button is clicked', () => {
    render(<RoomServiceModal isOpen={true} onClose={mockOnClose} />);

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should handle validation failure with undefined onSave', () => {
    mockValidateForm.mockReturnValue(false);

    render(<RoomServiceModal isOpen={true} onClose={mockOnClose} />);

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    expect(mockValidateForm).toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should directly test handleSave function with validation failure', () => {
    mockValidateForm.mockReturnValue(false);

    render(<RoomServiceModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} />);

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    expect(mockValidateForm).toHaveBeenCalled();
    expect(mockOnSave).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should test all branches of handleSave function', () => {
    mockValidateForm.mockReturnValue(true);
    render(<RoomServiceModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} />);
    const saveButton1 = screen.getByText('Save');
    fireEvent.click(saveButton1);
    expect(mockOnSave).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();

    jest.clearAllMocks();
    mockValidateForm.mockReturnValue(true);

    render(<RoomServiceModal isOpen={true} onClose={mockOnClose} />);
    const saveButton2 = screen.getAllByText('Save')[0];
    fireEvent.click(saveButton2);
    expect(mockOnClose).toHaveBeenCalled();

    jest.clearAllMocks();
    mockValidateForm.mockReturnValue(false);

    render(<RoomServiceModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} />);
    const saveButton3 = screen.getAllByText('Save')[0];
    fireEvent.click(saveButton3);
    expect(mockOnSave).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();

    jest.clearAllMocks();
    mockValidateForm.mockReturnValue(false);

    render(<RoomServiceModal isOpen={true} onClose={mockOnClose} />);
    const saveButton4 = screen.getAllByText('Save')[0];
    fireEvent.click(saveButton4);
    expect(mockOnClose).not.toHaveBeenCalled();
  });
});
