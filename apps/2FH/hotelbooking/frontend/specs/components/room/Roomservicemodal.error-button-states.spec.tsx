import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
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

describe('RoomServiceModal Error Handling & Button States', () => {
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

  it('should disable save button when there are validation errors', () => {
    const mockErrors = { bathroom: 'Bathroom is required', entertainment: 'Entertainment is required' };

    (useRoomServiceValidation as jest.Mock).mockReturnValueOnce({
      errors: mockErrors,
      validateForm: jest.fn().mockReturnValue(false),
      validateField: jest.fn().mockReturnValue(null),
      setErrors: jest.fn(),
    });

    render(<RoomServiceModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} />);

    const saveButton = screen.getByText('Fix 2 error(s)');
    expect(saveButton).toBeDisabled();
    expect(saveButton).toHaveClass('bg-gray-300');
    expect(saveButton).toHaveClass('text-gray-500');
    expect(saveButton).toHaveClass('cursor-not-allowed');
  });

  it('should enable save button when there are no validation errors', () => {
    const mockErrors = {};

    (useRoomServiceValidation as jest.Mock).mockReturnValueOnce({
      errors: mockErrors,
      validateForm: jest.fn().mockReturnValue(true),
      validateField: jest.fn().mockReturnValue(null),
      setErrors: jest.fn(),
    });

    render(<RoomServiceModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} />);

    const saveButton = screen.getByText('Save');
    expect(saveButton).not.toBeDisabled();
    expect(saveButton).toHaveClass('bg-blue-600');
    expect(saveButton).toHaveClass('text-white');
    expect(saveButton).toHaveClass('hover:bg-blue-700');
    expect(saveButton).toHaveClass('cursor-pointer');
  });

  it('should handle single validation error', () => {
    const mockErrors = { bathroom: 'Bathroom is required' };

    (useRoomServiceValidation as jest.Mock).mockReturnValueOnce({
      errors: mockErrors,
      validateForm: jest.fn().mockReturnValue(false),
      validateField: jest.fn().mockReturnValue(null),
      setErrors: jest.fn(),
    });

    render(<RoomServiceModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} />);

    const saveButton = screen.getByText('Fix 1 error(s)');
    expect(saveButton).toBeDisabled();
  });

  it('should handle multiple validation errors', () => {
    const mockErrors = {
      bathroom: 'Bathroom is required',
      entertainment: 'Entertainment is required',
      foodAndDrink: 'Food and drink is required',
    };

    (useRoomServiceValidation as jest.Mock).mockReturnValueOnce({
      errors: mockErrors,
      validateForm: jest.fn().mockReturnValue(false),
      validateField: jest.fn().mockReturnValue(null),
      setErrors: jest.fn(),
    });

    render(<RoomServiceModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} />);

    const saveButton = screen.getByText('Fix 3 error(s)');
    expect(saveButton).toBeDisabled();
  });

  it('should handle dynamic error count in button text', () => {
    const testCases = [
      { errors: { bathroom: 'error' }, expectedText: 'Fix 1 error(s)' },
      { errors: { bathroom: 'error', entertainment: 'error' }, expectedText: 'Fix 2 error(s)' },
      { errors: { bathroom: 'error', entertainment: 'error', foodAndDrink: 'error' }, expectedText: 'Fix 3 error(s)' },
    ];

    testCases.forEach(({ errors, expectedText }) => {
      (useRoomServiceValidation as jest.Mock).mockReturnValueOnce({
        errors,
        validateForm: jest.fn().mockReturnValue(false),
        validateField: jest.fn().mockReturnValue(null),
        setErrors: jest.fn(),
      });
      const { unmount } = render(<RoomServiceModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} />);
      const saveButton = screen.getByText(expectedText);
      expect(saveButton).toBeDisabled();

      unmount();
    });
  });
});
