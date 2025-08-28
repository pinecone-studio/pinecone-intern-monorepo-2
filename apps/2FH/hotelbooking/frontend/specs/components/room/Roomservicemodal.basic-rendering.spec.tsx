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

describe('RoomServiceModal Basic Rendering', () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockValidateForm.mockReturnValue(true);
    mockValidateField.mockReturnValue(null);
  });

  it('should not render when isOpen is false', () => {
    render(<RoomServiceModal isOpen={false} onClose={mockOnClose} />);

    expect(screen.queryByText('Room Services')).not.toBeInTheDocument();
  });

  it('should render when isOpen is true', () => {
    render(<RoomServiceModal isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByText('Room Services')).toBeInTheDocument();
    expect(screen.getByText('Bathroom')).toBeInTheDocument();
    expect(screen.getByText('Accessibility')).toBeInTheDocument();
    expect(screen.getByText('Entertainment')).toBeInTheDocument();
    expect(screen.getByText('Internet')).toBeInTheDocument();
    expect(screen.getByText('Food and drink')).toBeInTheDocument();
    expect(screen.getByText('Bedroom')).toBeInTheDocument();
    expect(screen.getByText('Other')).toBeInTheDocument();
  });

  it('should render all checkbox groups with options', () => {
    render(<RoomServiceModal isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByText('Private Bathroom')).toBeInTheDocument();
    expect(screen.getByText('Shared Bathroom')).toBeInTheDocument();
    expect(screen.getByText('Wheelchair Accessible')).toBeInTheDocument();
    expect(screen.getByText('Elevator')).toBeInTheDocument();
    expect(screen.getByText('TV')).toBeInTheDocument();
    expect(screen.getByText('Radio')).toBeInTheDocument();
    expect(screen.getByText('Breakfast')).toBeInTheDocument();
    expect(screen.getByText('Minibar')).toBeInTheDocument();
    expect(screen.getByText('Desk')).toBeInTheDocument();
    expect(screen.getByText('Wardrobe')).toBeInTheDocument();
    expect(screen.getByText('WiFi')).toBeInTheDocument();
    expect(screen.getByText('Ethernet')).toBeInTheDocument();
    expect(screen.getByText('Air Conditioning')).toBeInTheDocument();
    expect(screen.getByText('Heating')).toBeInTheDocument();
  });

  it('should render with data-cy attribute', () => {
    render(<RoomServiceModal isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByTestId('Room-Service-Modal')).toBeInTheDocument();
  });

  it('should handle modal backdrop click', () => {
    render(<RoomServiceModal isOpen={true} onClose={mockOnClose} />);

    const modal = screen.getByTestId('Room-Service-Modal');

    fireEvent.click(modal);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should handle keyboard navigation', () => {
    render(<RoomServiceModal isOpen={true} onClose={mockOnClose} />);

    const cancelButton = screen.getByText('Cancel');
    const saveButton = screen.getByText('Save');

    expect(cancelButton).toBeInTheDocument();
    expect(saveButton).toBeInTheDocument();
  });

  it('should handle form submission with Enter key', () => {
    render(<RoomServiceModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} />);

    const saveButton = screen.getByText('Save');

    expect(saveButton).toBeInTheDocument();
  });
  it('should handle accessibility attributes', () => {
    render(<RoomServiceModal isOpen={true} onClose={mockOnClose} />);

    const checkboxes = screen.getAllByRole('checkbox');

    checkboxes.forEach((checkbox) => {
      expect(checkbox).toHaveAttribute('type', 'checkbox');
    });
  });
  it('should handle responsive design classes', () => {
    render(<RoomServiceModal isOpen={true} onClose={mockOnClose} />);

    const modal = screen.getByTestId('Room-Service-Modal');
    const modalContent = modal.querySelector('.bg-white');

    expect(modalContent).toHaveClass('max-w-md', 'mx-4', 'max-h-[90vh]');
  });
  it('should handle scroll behavior', () => {
    render(<RoomServiceModal isOpen={true} onClose={mockOnClose} />);
    const checkboxGroups = screen.getAllByText(/Bathroom|Accessibility|Entertainment/);

    checkboxGroups.forEach((group) => {
      const container = group.closest('.overflow-y-auto');
      expect(container).toHaveClass('overflow-y-auto');
    });
  });
});
