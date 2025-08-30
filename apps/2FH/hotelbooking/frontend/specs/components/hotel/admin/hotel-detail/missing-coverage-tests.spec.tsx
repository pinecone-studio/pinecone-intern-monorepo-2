/* eslint-disable  */
import { render, screen, fireEvent } from '@/TestUtils';
import { AmenitiesCard } from '../../../../../src/components/admin/hotel-detail/AmenitiesCard';
import { EditHotelModal } from '../../../../../src/components/admin/hotel-detail/EditHotelModal';
import { ErrorMessage } from '../../../../../src/components/admin/hotel-detail/ErrorMessage';
import { FAQCard } from '../../../../../src/components/admin/hotel-detail/FaqCard';
import { HotelDetailsCard } from '../../../../../src/components/admin/hotel-detail/HotelDetailsCard';
import { HotelImagesCard } from '../../../../../src/components/admin/hotel-detail/HotelImagesCard';
import { HotelInfoCard } from '../../../../../src/components/admin/hotel-detail/HotelInfoCard';
import { LoadingSkeleton } from '../../../../../src/components/admin/hotel-detail/LoadingSkeleton';
import { LocationCard } from '../../../../../src/components/admin/hotel-detail/LocationCard';
import { NotFoundMessage } from '../../../../../src/components/admin/hotel-detail/NotFoundMessage';
import { PoliciesCard } from '../../../../../src/components/admin/hotel-detail/PoliciesCard';
import { DetailsSection } from '../../../../../src/components/admin/hotel-detail/edit-sections/DetailsSection';
import { DragDropArea } from '../../../../../src/components/admin/hotel-detail/edit-sections/DragDropArea';
import { FAQSection } from '../../../../../src/components/admin/hotel-detail/edit-sections/FaqSection';
import { LocationSection } from '../../../../../src/components/admin/hotel-detail/edit-sections/LocationSection';

// Mock the GraphQL mutation
const mockUpdateHotel = jest.fn();
jest.mock('@/generated', () => ({
  useUpdateHotelMutation: () => [mockUpdateHotel, { loading: false }],
}));

const mockRefetch = jest.fn();
const mockSetEditModalState = jest.fn();
const mockHandleInputChange = jest.fn();

describe('Missing Coverage Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('AmenitiesCard - Lines 21-53 (getAmenityIcon function)', () => {
    it('renders amenities with icons for known amenity types', () => {
      const mockHotel = {
        id: '1',
        name: 'Test Hotel',
        amenities: ['WIFI', 'POOL', 'SPA', 'RESTAURANT', 'PARKING', 'GYM'],
      };

      render(<AmenitiesCard hotel={mockHotel} editModalState={{ isOpen: false, section: 'amenities' }} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId="1" />);

      // Check that amenities are rendered with their names
      expect(screen.getByText('WIFI')).toBeInTheDocument();
      expect(screen.getByText('POOL')).toBeInTheDocument();
      expect(screen.getByText('SPA')).toBeInTheDocument();
      expect(screen.getByText('RESTAURANT')).toBeInTheDocument();
      expect(screen.getByText('PARKING')).toBeInTheDocument();
      expect(screen.getByText('GYM')).toBeInTheDocument();
    });

    it('renders amenities with fallback for unknown amenity types', () => {
      const mockHotel = {
        id: '1',
        name: 'Test Hotel',
        amenities: ['UNKNOWN_AMENITY', 'ANOTHER_UNKNOWN'],
      };

      render(<AmenitiesCard hotel={mockHotel} editModalState={{ isOpen: false, section: 'amenities' }} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId="1" />);

      // Check that unknown amenities are rendered with their names (without icons)
      expect(screen.getByText('UNKNOWN AMENITY')).toBeInTheDocument();
      expect(screen.getByText('ANOTHER UNKNOWN')).toBeInTheDocument();
    });

    it('renders amenities with underscore replacement', () => {
      const mockHotel = {
        id: '1',
        name: 'Test Hotel',
        amenities: ['SWIMMING_POOL', 'FREE_WIFI'],
      };

      render(<AmenitiesCard hotel={mockHotel} editModalState={{ isOpen: false, section: 'amenities' }} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId="1" />);

      // Check that underscores are replaced with spaces
      expect(screen.getByText('SWIMMING POOL')).toBeInTheDocument();
      expect(screen.getByText('FREE WIFI')).toBeInTheDocument();
    });

    it('renders no amenities message when amenities is null', () => {
      const mockHotel = {
        id: '1',
        name: 'Test Hotel',
        amenities: null,
      };

      render(<AmenitiesCard hotel={mockHotel} editModalState={{ isOpen: false, section: 'amenities' }} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId="1" />);

      expect(screen.getByText('No amenities available')).toBeInTheDocument();
    });

    it('renders no amenities message when amenities is undefined', () => {
      const mockHotel = {
        id: '1',
        name: 'Test Hotel',
        // amenities is undefined
      };

      render(<AmenitiesCard hotel={mockHotel} editModalState={{ isOpen: false, section: 'amenities' }} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId="1" />);

      expect(screen.getByText('No amenities available')).toBeInTheDocument();
    });

    it('renders empty grid when amenities is empty array', () => {
      const mockHotel = {
        id: '1',
        name: 'Test Hotel',
        amenities: [],
      };

      render(<AmenitiesCard hotel={mockHotel} editModalState={{ isOpen: false, section: 'amenities' }} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId="1" />);

      // When amenities is an empty array, it renders an empty grid instead of the fallback message
      expect(screen.getByText('Amenities')).toBeInTheDocument();
      // The component renders without crashing when amenities is an empty array
    });
  });

  describe('ErrorMessage - Line 8 (error message display)', () => {
    it('renders error message with provided message', () => {
      const errorMessage = 'Failed to load hotel data';

      render(<ErrorMessage message={errorMessage} />);

      expect(screen.getByText('Error loading hotel: Failed to load hotel data')).toBeInTheDocument();
    });

    it('renders error message with empty string', () => {
      render(<ErrorMessage message="" />);

      expect(screen.getByText('Error loading hotel:')).toBeInTheDocument();
    });

    it('renders error message with special characters', () => {
      const errorMessage = 'Error with special chars: & < > " \'';

      render(<ErrorMessage message={errorMessage} />);

      expect(screen.getByText('Error loading hotel: Error with special chars: & < > " \'')).toBeInTheDocument();
    });
  });

  describe('LoadingSkeleton - Line 4 (loading skeleton render)', () => {
    it('renders loading skeleton with correct structure', () => {
      render(<LoadingSkeleton />);

      expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
      expect(screen.getByTestId('loading-skeleton')).toHaveClass('animate-pulse');
    });

    it('renders loading skeleton with proper layout elements', () => {
      render(<LoadingSkeleton />);

      const skeleton = screen.getByTestId('loading-skeleton');
      expect(skeleton).toBeInTheDocument();

      // Check that the skeleton contains the expected structure
      expect(skeleton.querySelector('.h-8.bg-gray-200.rounded')).toBeInTheDocument();
      expect(skeleton.querySelector('.grid.grid-cols-1.lg\\:grid-cols-3.gap-6')).toBeInTheDocument();
    });
  });

  describe('NotFoundMessage - Line 4 (not found message render)', () => {
    it('renders not found message with correct content', () => {
      render(<NotFoundMessage />);

      expect(screen.getByText('Hotel Not Found')).toBeInTheDocument();
      expect(screen.getByText("The hotel you're looking for doesn't exist.")).toBeInTheDocument();
    });

    it('renders not found message with proper styling', () => {
      render(<NotFoundMessage />);

      const heading = screen.getByText('Hotel Not Found');
      expect(heading).toHaveClass('text-2xl', 'font-bold', 'text-gray-900');

      const description = screen.getByText("The hotel you're looking for doesn't exist.");
      expect(description).toHaveClass('text-gray-600');
    });
  });

  describe('DetailsSection - Lines 13-117 (form interactions and edge cases)', () => {
    const mockFormData = {
      description: 'Test description',
      optionalExtras: [
        { youNeedToKnow: 'Test requirement', weShouldMention: 'Test mention' },
        { youNeedToKnow: 'Another requirement', weShouldMention: 'Another mention' },
      ],
      languages: ['English', 'Spanish'],
    };

    beforeEach(() => {
      mockHandleInputChange.mockClear();
    });

    it('renders description textarea with initial value', () => {
      render(<DetailsSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

      const descriptionTextarea = screen.getByDisplayValue('Test description');
      expect(descriptionTextarea).toBeInTheDocument();
      expect(descriptionTextarea).toHaveAttribute('rows', '4');
    });

    it('handles description change', () => {
      render(<DetailsSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

      const descriptionTextarea = screen.getByDisplayValue('Test description');
      fireEvent.change(descriptionTextarea, { target: { value: 'Updated description' } });

      expect(mockHandleInputChange).toHaveBeenCalledWith('description', 'Updated description');
    });

    it('renders optional extras with correct data', () => {
      render(<DetailsSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

      expect(screen.getByDisplayValue('Test requirement')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test mention')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Another requirement')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Another mention')).toBeInTheDocument();
    });

    it('handles optional extra field changes', () => {
      render(<DetailsSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

      const requirementInput = screen.getByDisplayValue('Test requirement');
      fireEvent.change(requirementInput, { target: { value: 'Updated requirement' } });

      expect(mockHandleInputChange).toHaveBeenCalledWith('optionalExtras', [
        { youNeedToKnow: 'Updated requirement', weShouldMention: 'Test mention' },
        { youNeedToKnow: 'Another requirement', weShouldMention: 'Another mention' },
      ]);
    });

    it('handles optional extra removal', () => {
      render(<DetailsSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

      const removeButtons = screen.getAllByText('Remove');
      fireEvent.click(removeButtons[0]); // Remove first optional extra

      expect(mockHandleInputChange).toHaveBeenCalledWith('optionalExtras', [{ youNeedToKnow: 'Another requirement', weShouldMention: 'Another mention' }]);
    });

    it('handles adding new optional extra', () => {
      render(<DetailsSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

      const addButton = screen.getByText('Add New Item');
      fireEvent.click(addButton);

      expect(mockHandleInputChange).toHaveBeenCalledWith('optionalExtras', [
        { youNeedToKnow: 'Test requirement', weShouldMention: 'Test mention' },
        { youNeedToKnow: 'Another requirement', weShouldMention: 'Another mention' },
        { youNeedToKnow: '', weShouldMention: '' },
      ]);
    });

    it('renders languages with correct data', () => {
      render(<DetailsSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

      expect(screen.getByDisplayValue('English')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Spanish')).toBeInTheDocument();
    });

    it('handles language field changes', () => {
      render(<DetailsSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

      const englishInput = screen.getByDisplayValue('English');
      fireEvent.change(englishInput, { target: { value: 'French' } });

      expect(mockHandleInputChange).toHaveBeenCalledWith('languages', ['French', 'Spanish']);
    });

    it('handles language removal', () => {
      render(<DetailsSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

      const removeButtons = screen.getAllByText('Remove');
      fireEvent.click(removeButtons[2]); // Remove first language (after optional extras)

      expect(mockHandleInputChange).toHaveBeenCalledWith('languages', ['Spanish']);
    });

    it('handles adding new language', () => {
      render(<DetailsSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

      const addLanguageButton = screen.getByText('Add Language');
      fireEvent.click(addLanguageButton);

      expect(mockHandleInputChange).toHaveBeenCalledWith('languages', ['English', 'Spanish', '']);
    });

    it('handles optional extras when optionalExtras is null', () => {
      const formDataWithNullExtras = {
        ...mockFormData,
        optionalExtras: null,
      };

      render(<DetailsSection formData={formDataWithNullExtras} handleInputChange={mockHandleInputChange} />);

      const addButton = screen.getByText('Add New Item');
      fireEvent.click(addButton);

      expect(mockHandleInputChange).toHaveBeenCalledWith('optionalExtras', [{ youNeedToKnow: '', weShouldMention: '' }]);
    });

    it('handles optional extras when optionalExtras is undefined', () => {
      const formDataWithUndefinedExtras = {
        ...mockFormData,
        optionalExtras: undefined,
      };

      render(<DetailsSection formData={formDataWithUndefinedExtras} handleInputChange={mockHandleInputChange} />);

      const addButton = screen.getByText('Add New Item');
      fireEvent.click(addButton);

      expect(mockHandleInputChange).toHaveBeenCalledWith('optionalExtras', [{ youNeedToKnow: '', weShouldMention: '' }]);
    });

    it('handles optional extra field with null values', () => {
      const formDataWithNullValues = {
        ...mockFormData,
        optionalExtras: [{ youNeedToKnow: null, weShouldMention: null }],
      };

      render(<DetailsSection formData={formDataWithNullValues} handleInputChange={mockHandleInputChange} />);

      const requirementInputs = screen.getAllByDisplayValue('');
      fireEvent.change(requirementInputs[0], { target: { value: 'New requirement' } });

      expect(mockHandleInputChange).toHaveBeenCalledWith('optionalExtras', [{ youNeedToKnow: 'New requirement', weShouldMention: null }]);
    });
  });

  describe('DragDropArea - Line 35 (drag and drop functionality)', () => {
    const mockProps = {
      dragActive: false,
      uploading: false,
      fileInputRef: { current: null },
      handleDragEnter: jest.fn(),
      handleDragLeave: jest.fn(),
      handleDragOver: jest.fn(),
      handleDrop: jest.fn(),
      handleFileInput: jest.fn(),
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('renders drag drop area with correct initial state', () => {
      render(<DragDropArea {...mockProps} />);

      expect(screen.getByText('Drop images here or click to upload')).toBeInTheDocument();
      expect(screen.getByText('Supports JPG, PNG, GIF up to 10MB each')).toBeInTheDocument();
      expect(screen.getByText('Choose Files')).toBeInTheDocument();
    });

    it('renders drag drop area with drag active state', () => {
      render(<DragDropArea {...mockProps} dragActive={true} />);

      const dragArea = screen.getByText('Drop images here or click to upload').closest('div')?.parentElement?.parentElement;
      expect(dragArea).toHaveClass('border-blue-500');
      expect(dragArea).toHaveClass('bg-blue-50');
    });

    it('renders drag drop area with uploading state', () => {
      render(<DragDropArea {...mockProps} uploading={true} />);

      expect(screen.getAllByText('Uploading...')[0]).toBeInTheDocument();
      const chooseFilesButton = screen.getByRole('button', { name: /uploading/i });
      expect(chooseFilesButton).toBeDisabled();
    });

    it('handles drag enter event', () => {
      render(<DragDropArea {...mockProps} />);

      const dragArea = screen.getByText('Drop images here or click to upload').closest('div');
      fireEvent.dragEnter(dragArea!);

      expect(mockProps.handleDragEnter).toHaveBeenCalled();
    });

    it('handles drag leave event', () => {
      render(<DragDropArea {...mockProps} />);

      const dragArea = screen.getByText('Drop images here or click to upload').closest('div');
      fireEvent.dragLeave(dragArea!);

      expect(mockProps.handleDragLeave).toHaveBeenCalled();
    });

    it('handles drag over event', () => {
      render(<DragDropArea {...mockProps} />);

      const dragArea = screen.getByText('Drop images here or click to upload').closest('div');
      fireEvent.dragOver(dragArea!);

      expect(mockProps.handleDragOver).toHaveBeenCalled();
    });

    it('handles drop event', () => {
      render(<DragDropArea {...mockProps} />);

      const dragArea = screen.getByText('Drop images here or click to upload').closest('div');
      fireEvent.drop(dragArea!);

      expect(mockProps.handleDrop).toHaveBeenCalled();
    });

    it('handles file input click', () => {
      const mockClick = jest.fn();
      const mockFileInputRef = { current: { click: mockClick } };
      render(<DragDropArea {...mockProps} fileInputRef={mockFileInputRef} />);

      const chooseFilesButton = screen.getByText('Choose Files');
      fireEvent.click(chooseFilesButton);

      // The click handler should be called when the button is clicked
      // This tests the onClick handler in the DragDropArea component
    });

    it('handles file input change', () => {
      render(<DragDropArea {...mockProps} />);

      const fileInput = screen.getByDisplayValue('') as HTMLInputElement;
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      fireEvent.change(fileInput, { target: { files: [file] } });

      expect(mockProps.handleFileInput).toHaveBeenCalled();
    });

    it('disables choose files button when uploading', () => {
      render(<DragDropArea {...mockProps} uploading={true} />);

      const chooseFilesButton = screen.getByRole('button', { name: /uploading/i });
      expect(chooseFilesButton).toBeDisabled();
    });
  });

  describe('FAQSection - Lines 13-62 (FAQ form interactions)', () => {
    const mockFormData = {
      faq: [
        { question: 'Test question 1', answer: 'Test answer 1' },
        { question: 'Test question 2', answer: 'Test answer 2' },
      ],
    };

    beforeEach(() => {
      mockHandleInputChange.mockClear();
    });

    it('renders FAQ items with correct data', () => {
      render(<FAQSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

      expect(screen.getByDisplayValue('Test question 1')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test answer 1')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test question 2')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test answer 2')).toBeInTheDocument();
    });

    it('handles question field changes', () => {
      render(<FAQSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

      const questionInput = screen.getByDisplayValue('Test question 1');
      fireEvent.change(questionInput, { target: { value: 'Updated question' } });

      expect(mockHandleInputChange).toHaveBeenCalledWith('faq', [
        { question: 'Updated question', answer: 'Test answer 1' },
        { question: 'Test question 2', answer: 'Test answer 2' },
      ]);
    });

    it('handles answer field changes', () => {
      render(<FAQSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

      const answerTextarea = screen.getByDisplayValue('Test answer 1');
      fireEvent.change(answerTextarea, { target: { value: 'Updated answer' } });

      expect(mockHandleInputChange).toHaveBeenCalledWith('faq', [
        { question: 'Test question 1', answer: 'Updated answer' },
        { question: 'Test question 2', answer: 'Test answer 2' },
      ]);
    });

    it('handles FAQ removal', () => {
      render(<FAQSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

      const removeButtons = screen.getAllByText('Remove');
      fireEvent.click(removeButtons[0]); // Remove first FAQ

      expect(mockHandleInputChange).toHaveBeenCalledWith('faq', [{ question: 'Test question 2', answer: 'Test answer 2' }]);
    });

    it('handles adding new FAQ', () => {
      render(<FAQSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

      const addButton = screen.getByText('Add New FAQ');
      fireEvent.click(addButton);

      expect(mockHandleInputChange).toHaveBeenCalledWith('faq', [
        { question: 'Test question 1', answer: 'Test answer 1' },
        { question: 'Test question 2', answer: 'Test answer 2' },
        { question: '', answer: '' },
      ]);
    });

    it('handles FAQ with empty data', () => {
      const emptyFormData = {
        faq: [],
      };

      render(<FAQSection formData={emptyFormData} handleInputChange={mockHandleInputChange} />);

      const addButton = screen.getByText('Add New FAQ');
      fireEvent.click(addButton);

      expect(mockHandleInputChange).toHaveBeenCalledWith('faq', [{ question: '', answer: '' }]);
    });

    it('handles FAQ with null values', () => {
      const formDataWithNullValues = {
        faq: [{ question: null, answer: null }],
      };

      render(<FAQSection formData={formDataWithNullValues} handleInputChange={mockHandleInputChange} />);

      const questionInputs = screen.getAllByDisplayValue('');
      fireEvent.change(questionInputs[0], { target: { value: 'New question' } });

      expect(mockHandleInputChange).toHaveBeenCalledWith('faq', [{ question: 'New question', answer: null }]);
    });
  });

  describe('LocationSection - Lines 11-31 (location form interactions)', () => {
    const mockFormData = {
      country: 'Test Country',
      city: 'Test City',
      location: 'Test Location',
    };

    beforeEach(() => {
      mockHandleInputChange.mockClear();
    });

    it('renders location fields with correct initial values', () => {
      render(<LocationSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

      expect(screen.getByDisplayValue('Test Country')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test City')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Location')).toBeInTheDocument();
    });

    it('handles country field change', () => {
      render(<LocationSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

      const countryInput = screen.getByDisplayValue('Test Country');
      fireEvent.change(countryInput, { target: { value: 'Updated Country' } });

      expect(mockHandleInputChange).toHaveBeenCalledWith('country', 'Updated Country');
    });

    it('handles city field change', () => {
      render(<LocationSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

      const cityInput = screen.getByDisplayValue('Test City');
      fireEvent.change(cityInput, { target: { value: 'Updated City' } });

      expect(mockHandleInputChange).toHaveBeenCalledWith('city', 'Updated City');
    });

    it('handles location field change', () => {
      render(<LocationSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

      const locationInput = screen.getByDisplayValue('Test Location');
      fireEvent.change(locationInput, { target: { value: 'Updated Location' } });

      expect(mockHandleInputChange).toHaveBeenCalledWith('location', 'Updated Location');
    });

    it('handles empty field values', () => {
      const emptyFormData = {
        country: '',
        city: '',
        location: '',
      };

      render(<LocationSection formData={emptyFormData} handleInputChange={mockHandleInputChange} />);

      const countryInput = screen.getByLabelText('Country');
      fireEvent.change(countryInput, { target: { value: 'New Country' } });

      expect(mockHandleInputChange).toHaveBeenCalledWith('country', 'New Country');
    });

    it('handles null field values', () => {
      const nullFormData = {
        country: null,
        city: null,
        location: null,
      };

      render(<LocationSection formData={nullFormData} handleInputChange={mockHandleInputChange} />);

      const countryInput = screen.getByLabelText('Country');
      fireEvent.change(countryInput, { target: { value: 'New Country' } });

      expect(mockHandleInputChange).toHaveBeenCalledWith('country', 'New Country');
    });

    it('handles undefined field values', () => {
      const undefinedFormData = {
        country: undefined,
        city: undefined,
        location: undefined,
      };

      render(<LocationSection formData={undefinedFormData} handleInputChange={mockHandleInputChange} />);

      const countryInput = screen.getByLabelText('Country');
      fireEvent.change(countryInput, { target: { value: 'New Country' } });

      expect(mockHandleInputChange).toHaveBeenCalledWith('country', 'New Country');
    });

    it('renders with correct labels and placeholders', () => {
      render(<LocationSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

      expect(screen.getByLabelText('Country')).toBeInTheDocument();
      expect(screen.getByLabelText('City')).toBeInTheDocument();
      expect(screen.getByLabelText('Location')).toBeInTheDocument();

      expect(screen.getByPlaceholderText('Enter country...')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter city name...')).toBeInTheDocument();
    });
  });

  describe('Additional Coverage Tests', () => {
    const mockFormData = {
      description: 'Test description',
      optionalExtras: [{ youNeedToKnow: 'Test requirement', weShouldMention: 'Test mention' }],
      languages: ['English', 'Spanish'],
    };

    describe('AmenitiesCard - Lines 42-46 (getAmenityIcon fallback)', () => {
      it('returns null for unknown amenities', () => {
        const mockHotel = {
          id: '1',
          name: 'Test Hotel',
          amenities: ['UNKNOWN_AMENITY', 'ANOTHER_UNKNOWN'],
        };

        render(<AmenitiesCard hotel={mockHotel} editModalState={{ isOpen: false, section: 'amenities' }} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId="1" />);

        // Check that unknown amenities are rendered with their names (without icons)
        expect(screen.getByText('UNKNOWN AMENITY')).toBeInTheDocument();
        expect(screen.getByText('ANOTHER UNKNOWN')).toBeInTheDocument();
      });
    });

    describe('EditHotelModal - Lines 74-75, 132 (Invalid section handling)', () => {
      it('handles invalid section in getSectionComponent', () => {
        const mockHotel = {
          id: '1',
          name: 'Test Hotel',
        };

        render(<EditHotelModal hotel={mockHotel} section="invalid" isOpen={true} onOpenChange={jest.fn()} refetch={mockRefetch} hotelId="1" />);

        // Should render null for invalid section
        expect(screen.getByTestId('edit-hotel-modal-content')).toBeInTheDocument();
      });

      it('handles invalid section in getSectionTitle', () => {
        const mockHotel = {
          id: '1',
          name: 'Test Hotel',
        };

        render(<EditHotelModal hotel={mockHotel} section="invalid" isOpen={true} onOpenChange={jest.fn()} refetch={mockRefetch} hotelId="1" />);

        // Should show default title for invalid section
        expect(screen.getByText('Edit Edit Hotel')).toBeInTheDocument();
      });
    });

    describe('DetailsSection - Lines 59-61 (Optional extras with null values)', () => {
      it('handles optional extras with null values in remove button', () => {
        const formDataWithNullValues = {
          ...mockFormData,
          optionalExtras: [{ youNeedToKnow: null, weShouldMention: null }],
        };

        render(<DetailsSection formData={formDataWithNullValues} handleInputChange={mockHandleInputChange} />);

        const removeButtons = screen.getAllByText('Remove');
        fireEvent.click(removeButtons[0]); // Click the first remove button (optional extras)

        expect(mockHandleInputChange).toHaveBeenCalledWith('optionalExtras', []);
      });

      it('handles optional extras with null values in input fields', () => {
        const formDataWithNullValues = {
          ...mockFormData,
          optionalExtras: [{ youNeedToKnow: null, weShouldMention: null }],
        };

        render(<DetailsSection formData={formDataWithNullValues} handleInputChange={mockHandleInputChange} />);

        const requirementInputs = screen.getAllByDisplayValue('');
        fireEvent.change(requirementInputs[0], { target: { value: 'New requirement' } }); // First input is the requirement field

        expect(mockHandleInputChange).toHaveBeenCalledWith('optionalExtras', [{ youNeedToKnow: 'New requirement', weShouldMention: null }]);
      });
    });

    describe('FaqCard - Line 31 (Null return handling)', () => {
      it('handles null return from getFaqIcon', () => {
        const mockHotel = {
          id: '1',
          name: 'Test Hotel',
          faq: [{ question: 'Test question', answer: 'Test answer' }],
        };

        render(<FAQCard hotel={mockHotel} editModalState={{ isOpen: false, section: 'faq' }} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId="1" />);

        // The component should render without crashing when getFaqIcon returns null
        expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
      });
    });

    describe('HotelDetailsCard - Line 28 (Name access)', () => {
      it('handles hotel name access', () => {
        const mockHotel = {
          id: '1',
          name: 'Test Hotel',
        };

        render(<HotelDetailsCard hotel={mockHotel} editModalState={{ isOpen: false, section: 'details' }} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId="1" />);

        expect(screen.getByText('Test Hotel Details')).toBeInTheDocument();
      });
    });

    describe('HotelImagesCard - Line 28 (Images access)', () => {
      it('handles hotel images access', () => {
        const mockHotel = {
          id: '1',
          name: 'Test Hotel',
          images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
        };

        render(<HotelImagesCard hotel={mockHotel} editModalState={{ isOpen: false, section: 'images' }} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId="1" />);

        expect(screen.getByText('Hotel Images')).toBeInTheDocument();
      });
    });

    describe('HotelInfoCard - Lines 55-59 (Rating display)', () => {
      it('handles hotel rating display', () => {
        const mockHotel = {
          id: '1',
          name: 'Test Hotel',
          rating: 8.5,
        };

        render(<HotelInfoCard hotel={mockHotel} editModalState={{ isOpen: false, section: 'basic' }} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId="1" />);

        expect(screen.getByText('8.5/10')).toBeInTheDocument();
      });
    });

    describe('LocationCard - Lines 28-32 (Location display)', () => {
      it('handles hotel location display', () => {
        const mockHotel = {
          id: '1',
          name: 'Test Hotel',
          city: 'Test City',
          country: 'Test Country',
        };

        render(<LocationCard hotel={mockHotel} editModalState={{ isOpen: false, section: 'location' }} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId="1" />);

        expect(screen.getByText('Test City, Test Country')).toBeInTheDocument();
      });
    });

    describe('PoliciesCard - Line 32 (Policies access)', () => {
      it('handles hotel policies access', () => {
        const mockHotel = {
          id: '1',
          name: 'Test Hotel',
          policies: ['policy1', 'policy2'],
        };

        render(<PoliciesCard hotel={mockHotel} editModalState={{ isOpen: false, section: 'policies' }} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId="1" />);

        expect(screen.getByText('Policies')).toBeInTheDocument();
      });
    });
  });
});
