/* eslint-disable */
import { render, screen, fireEvent, waitFor } from '@/TestUtils';
import { EditHotelModal } from '../../../../../src/components/admin/hotel-detail/EditHotelModal';
import { FAQCard } from '../../../../../src/components/admin/hotel-detail/FaqCard';
import { HotelDetailsCard } from '../../../../../src/components/admin/hotel-detail/HotelDetailsCard';
import { HotelImagesCard } from '../../../../../src/components/admin/hotel-detail/HotelImagesCard';
import { HotelInfoCard } from '../../../../../src/components/admin/hotel-detail/HotelInfoCard';
import { LocationCard } from '../../../../../src/components/admin/hotel-detail/LocationCard';
import { PoliciesCard } from '../../../../../src/components/admin/hotel-detail/PoliciesCard';

// Mock the GraphQL mutation
const mockUpdateHotel = jest.fn();
jest.mock('@apollo/client', () => ({
  useMutation: () => [mockUpdateHotel, { loading: false }],
  gql: jest.fn(),
}));

// Mock window.alert
Object.defineProperty(window, 'alert', {
  writable: true,
  value: jest.fn(),
});

const mockRefetch = jest.fn();
const mockSetEditModalState = jest.fn();

describe('Hotel Detail Components - Coverage Gap Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('EditHotelModal - Line 132 (getSectionComponent fallback)', () => {
    it('returns null for invalid section in getSectionComponent', () => {
      const mockHotel = {
        id: '1',
        name: 'Test Hotel',
        description: 'Test Description',
        phone: '123-456-7890',
        city: 'Test City',
        country: 'Test Country',
        location: 'Test Location',
        amenities: ['WIFI', 'POOL'],
        languages: ['English', 'Spanish'],
        policies: [],
        faq: [],
        images: [],
        optionalExtras: [],
      };

      render(<EditHotelModal hotel={mockHotel} section="invalid" as any isOpen={true} onOpenChange={jest.fn()} refetch={mockRefetch} hotelId="1" />);

      // The component should render but the section component should be null
      expect(screen.getByTestId('edit-hotel-modal-content')).toBeInTheDocument();
    });
  });

  describe('EditHotelModal - Line 132 (getSectionComponent with valid section)', () => {
    it('returns component for valid section in getSectionComponent', () => {
      const mockHotel = {
        id: '1',
        name: 'Test Hotel',
        description: 'Test Description',
        phone: '123-456-7890',
        city: 'Test City',
        country: 'Test Country',
        location: 'Test Location',
        amenities: ['WIFI', 'POOL'],
        languages: ['English', 'Spanish'],
        policies: [],
        faq: [],
        images: [],
        optionalExtras: [],
      };

      render(<EditHotelModal hotel={mockHotel} section="basic" isOpen={true} onOpenChange={jest.fn()} refetch={mockRefetch} hotelId="1" />);

      // Should render the basic info section
      expect(screen.getByTestId('edit-hotel-modal-content')).toBeInTheDocument();
    });
  });

  describe('FAQCard - Line 31 (return null)', () => {
    it('returns null when hotel.faq is null', () => {
      const mockHotel = {
        id: '1',
        name: 'Test Hotel',
        faq: null,
      };

      const { container } = render(<FAQCard hotel={mockHotel} editModalState={{ isOpen: false, section: 'faq' }} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId="1" />);

      expect(container.firstChild).toBeNull();
    });

    it('returns null when hotel.faq is undefined', () => {
      const mockHotel = {
        id: '1',
        name: 'Test Hotel',
        // faq is undefined
      };

      const { container } = render(<FAQCard hotel={mockHotel} editModalState={{ isOpen: false, section: 'faq' }} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId="1" />);

      expect(container.firstChild).toBeNull();
    });

    it('returns null when hotel.faq is empty array', () => {
      const mockHotel = {
        id: '1',
        name: 'Test Hotel',
        faq: [],
      };

      const { container } = render(<FAQCard hotel={mockHotel} editModalState={{ isOpen: false, section: 'faq' }} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId="1" />);

      expect(container.firstChild).toBeNull();
    });
  });

  describe('HotelDetailsCard - Line 28 (optionalExtras conditional)', () => {
    it('renders optionalExtras section when optionalExtras exists and has length > 0', () => {
      const mockHotel = {
        id: '1',
        name: 'Test Hotel',
        description: 'Test Description',
        optionalExtras: [
          {
            youNeedToKnow: 'Test requirement',
            weShouldMention: 'Test mention',
          },
        ],
        languages: ['English'],
      };

      render(<HotelDetailsCard hotel={mockHotel} editModalState={{ isOpen: false, section: 'details' }} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId="1" />);

      expect(screen.getByTestId('optional-extras-section')).toBeInTheDocument();
      expect(screen.getByText('What You Need to Know')).toBeInTheDocument();
    });

    it('does not render optionalExtras section when optionalExtras is empty array', () => {
      const mockHotel = {
        id: '1',
        name: 'Test Hotel',
        description: 'Test Description',
        optionalExtras: [],
        languages: ['English'],
      };

      render(<HotelDetailsCard hotel={mockHotel} editModalState={{ isOpen: false, section: 'details' }} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId="1" />);

      expect(screen.queryByTestId('optional-extras-section')).not.toBeInTheDocument();
      expect(screen.queryByText('What You Need to Know')).not.toBeInTheDocument();
    });
  });

  describe('HotelImagesCard - Line 28 (images conditional)', () => {
    it('renders images grid when images exist and have length > 0', () => {
      const mockHotel = {
        id: '1',
        name: 'Test Hotel',
        images: ['/image1.jpg', '/image2.jpg'],
      };

      render(<HotelImagesCard hotel={mockHotel} editModalState={{ isOpen: false, section: 'images' }} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId="1" />);

      expect(screen.getByTestId('images-grid')).toBeInTheDocument();
      expect(screen.getAllByTestId('hotel-image')).toHaveLength(2);
    });

    it('renders no images message when images is empty array', () => {
      const mockHotel = {
        id: '1',
        name: 'Test Hotel',
        images: [],
      };

      render(<HotelImagesCard hotel={mockHotel} editModalState={{ isOpen: false, section: 'images' }} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId="1" />);

      expect(screen.queryByTestId('images-grid')).not.toBeInTheDocument();
      expect(screen.getByText('No images available')).toBeInTheDocument();
    });
  });

  describe('HotelInfoCard - Line 34 (starsDisplay fallback)', () => {
    it('handles starsDisplay when starsArray is empty', () => {
      const mockHotel = {
        id: '1',
        name: 'Test Hotel',
        description: 'Test Description',
        phone: '123-456-7890',
        rating: 8.5,
        stars: 0, // This will result in empty starsArray
        city: 'Test City',
        country: 'Test Country',
        location: 'Test Location',
        amenities: ['WIFI', 'POOL'],
        languages: ['English', 'Spanish'],
        policies: [],
        faq: [],
        images: [],
        optionalExtras: [],
      };

      render(<HotelInfoCard hotel={mockHotel} editModalState={{ isOpen: false, section: 'basic' }} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId="1" />);

      const starsContainer = screen.getByTestId('stars-container');
      expect(starsContainer).toBeInTheDocument();
      expect(starsContainer.children.length).toBe(0);
    });
  });

  describe('HotelInfoCard - Lines 55-59 (getStarsText edge cases)', () => {
    it('handles undefined stars in getStarsText', () => {
      const mockHotel = {
        id: '1',
        name: 'Test Hotel',
        description: 'Test Description',
        phone: '123-456-7890',
        rating: 8.5,
        stars: undefined,
        city: 'Test City',
        country: 'Test Country',
        location: 'Test Location',
        amenities: ['WIFI', 'POOL'],
        languages: ['English', 'Spanish'],
        policies: [],
        faq: [],
        images: [],
        optionalExtras: [],
      };

      render(<HotelInfoCard hotel={mockHotel} editModalState={{ isOpen: false, section: 'basic' }} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId="1" />);

      expect(screen.getByText('(undefined stars)')).toBeInTheDocument();
    });

    it('handles null stars in getStarsText', () => {
      const mockHotel = {
        id: '1',
        name: 'Test Hotel',
        description: 'Test Description',
        phone: '123-456-7890',
        rating: 8.5,
        stars: null,
        city: 'Test City',
        country: 'Test Country',
        location: 'Test Location',
        amenities: ['WIFI', 'POOL'],
        languages: ['English', 'Spanish'],
        policies: [],
        faq: [],
        images: [],
        optionalExtras: [],
      };

      render(<HotelInfoCard hotel={mockHotel} editModalState={{ isOpen: false, section: 'basic' }} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId="1" />);

      expect(screen.getByText('(null stars)')).toBeInTheDocument();
    });

    it('handles string stars in getStarsText', () => {
      const mockHotel = {
        id: '1',
        name: 'Test Hotel',
        description: 'Test Description',
        phone: '123-456-7890',
        rating: 8.5,
        stars: '4',
        city: 'Test City',
        country: 'Test Country',
        location: 'Test Location',
        amenities: ['WIFI', 'POOL'],
        languages: ['English', 'Spanish'],
        policies: [],
        faq: [],
        images: [],
        optionalExtras: [],
      };

      render(<HotelInfoCard hotel={mockHotel} editModalState={{ isOpen: false, section: 'basic' }} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId="1" />);

      expect(screen.getByText('(4 stars)')).toBeInTheDocument();
    });

    it('handles NaN stars in getStarsText', () => {
      const mockHotel = {
        id: '1',
        name: 'Test Hotel',
        description: 'Test Description',
        phone: '123-456-7890',
        rating: 8.5,
        stars: NaN,
        city: 'Test City',
        country: 'Test Country',
        location: 'Test Location',
        amenities: ['WIFI', 'POOL'],
        languages: ['English', 'Spanish'],
        policies: [],
        faq: [],
        images: [],
        optionalExtras: [],
      };

      render(<HotelInfoCard hotel={mockHotel} editModalState={{ isOpen: false, section: 'basic' }} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId="1" />);

      expect(screen.getByText('(NaN stars)')).toBeInTheDocument();
    });
  });

  describe('LocationCard - Line 28 (city-country display)', () => {
    it('renders city and country when both are present', () => {
      const mockHotel = {
        id: '1',
        name: 'Test Hotel',
        location: 'Test Location',
        city: 'Test City',
        country: 'Test Country',
        phone: '123-456-7890',
      };

      render(<LocationCard hotel={mockHotel} editModalState={{ isOpen: false, section: 'location' }} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId="1" />);

      expect(screen.getByTestId('city-country')).toBeInTheDocument();
      expect(screen.getByText('Test City, Test Country')).toBeInTheDocument();
    });

    it('renders city and country when they are null/undefined', () => {
      const mockHotel = {
        id: '1',
        name: 'Test Hotel',
        location: 'Test Location',
        city: null,
        country: undefined,
        phone: '123-456-7890',
      };

      render(<LocationCard hotel={mockHotel} editModalState={{ isOpen: false, section: 'location' }} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId="1" />);

      expect(screen.getByTestId('city-country')).toBeInTheDocument();
      // The text content shows just a comma and space when city and country are null/undefined
      const cityCountryElement = screen.getByTestId('city-country');
      expect(cityCountryElement.textContent).toBe(', ');
    });
  });

  describe('PoliciesCard - Line 32 (return null)', () => {
    it('returns null when hotel.policies is null', () => {
      const mockHotel = {
        id: '1',
        name: 'Test Hotel',
        policies: null,
      };

      const { container } = render(
        <PoliciesCard hotel={mockHotel} editModalState={{ isOpen: false, section: 'policies' }} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId="1" />
      );

      expect(container.firstChild).toBeNull();
    });

    it('returns null when hotel.policies is undefined', () => {
      const mockHotel = {
        id: '1',
        name: 'Test Hotel',
        // policies is undefined
      };

      const { container } = render(
        <PoliciesCard hotel={mockHotel} editModalState={{ isOpen: false, section: 'policies' }} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId="1" />
      );

      expect(container.firstChild).toBeNull();
    });

    it('returns null when hotel.policies is empty array', () => {
      const mockHotel = {
        id: '1',
        name: 'Test Hotel',
        policies: [],
      };

      const { container } = render(
        <PoliciesCard hotel={mockHotel} editModalState={{ isOpen: false, section: 'policies' }} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId="1" />
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe('EditHotelModal - Error handling in handleSave', () => {
    it('handles error when updateHotel mutation fails', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

      mockUpdateHotel.mockRejectedValue(new Error('Network error'));

      const originalHotel = {
        id: '1',
        name: 'Test Hotel',
        description: 'Original Description',
        phone: '123-456-7890',
        city: 'Test City',
        country: 'Test Country',
        location: 'Test Location',
        amenities: ['WIFI', 'POOL'],
        languages: ['English', 'Spanish'],
        policies: [],
        faq: [],
        images: [],
        optionalExtras: [],
      };

      const mockOnOpenChange = jest.fn();

      render(<EditHotelModal hotel={originalHotel} section="basic" isOpen={true} onOpenChange={mockOnOpenChange} refetch={mockRefetch} hotelId="1" />);

      // Change the description to trigger an update
      const descriptionTextarea = screen.getByDisplayValue('Original Description');
      fireEvent.change(descriptionTextarea, { target: { value: 'Modified Description' } });

      // Trigger save
      const saveButton = screen.getByTestId('edit-hotel-modal-save');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error updating hotel:', expect.any(Error));
        expect(alertSpy).toHaveBeenCalledWith('Error updating hotel. Please try again.');
      });

      consoleSpy.mockRestore();
      alertSpy.mockRestore();
    });

    it('handles error when updateHotel returns success: false', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

      mockUpdateHotel.mockResolvedValue({
        data: {
          updateHotel: {
            success: false,
            message: 'Update failed',
          },
        },
      });

      const originalHotel = {
        id: '1',
        name: 'Test Hotel',
        description: 'Original Description',
        phone: '123-456-7890',
        city: 'Test City',
        country: 'Test Country',
        location: 'Test Location',
        amenities: ['WIFI', 'POOL'],
        languages: ['English', 'Spanish'],
        policies: [],
        faq: [],
        images: [],
        optionalExtras: [],
      };

      const mockOnOpenChange = jest.fn();

      render(<EditHotelModal hotel={originalHotel} section="basic" isOpen={true} onOpenChange={mockOnOpenChange} refetch={mockRefetch} hotelId="1" />);

      // Change the description to trigger an update
      const descriptionTextarea = screen.getByDisplayValue('Original Description');
      fireEvent.change(descriptionTextarea, { target: { value: 'Modified Description' } });

      // Trigger save
      const saveButton = screen.getByTestId('edit-hotel-modal-save');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Failed to update hotel:', 'Update failed');
        expect(alertSpy).toHaveBeenCalledWith('Failed to update hotel. Please try again.');
      });

      consoleSpy.mockRestore();
      alertSpy.mockRestore();
    });

    it('handles error when updateHotel returns success: false with no message', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

      mockUpdateHotel.mockResolvedValue({
        data: {
          updateHotel: {
            success: false,
            message: null,
          },
        },
      });

      const originalHotel = {
        id: '1',
        name: 'Test Hotel',
        description: 'Original Description',
        phone: '123-456-7890',
        city: 'Test City',
        country: 'Test Country',
        location: 'Test Location',
        amenities: ['WIFI', 'POOL'],
        languages: ['English', 'Spanish'],
        policies: [],
        faq: [],
        images: [],
        optionalExtras: [],
      };

      const mockOnOpenChange = jest.fn();

      render(<EditHotelModal hotel={originalHotel} section="basic" isOpen={true} onOpenChange={mockOnOpenChange} refetch={mockRefetch} hotelId="1" />);

      // Change the description to trigger an update
      const descriptionTextarea = screen.getByDisplayValue('Original Description');
      fireEvent.change(descriptionTextarea, { target: { value: 'Modified Description' } });

      // Trigger save
      const saveButton = screen.getByTestId('edit-hotel-modal-save');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Failed to update hotel:', 'Unknown error');
        expect(alertSpy).toHaveBeenCalledWith('Failed to update hotel. Please try again.');
      });

      consoleSpy.mockRestore();
      alertSpy.mockRestore();
    });
  });

  describe('EditHotelModal - No changes scenario', () => {
    it('closes modal when no changes are made', async () => {
      const mockHotel = {
        id: '1',
        name: 'Test Hotel',
        description: 'Test Description',
        phone: '123-456-7890',
        city: 'Test City',
        country: 'Test Country',
        location: 'Test Location',
        amenities: ['WIFI', 'POOL'],
        languages: ['English', 'Spanish'],
        policies: [],
        faq: [],
        images: [],
        optionalExtras: [],
      };

      const mockOnOpenChange = jest.fn();

      render(<EditHotelModal hotel={mockHotel} section="basic" isOpen={true} onOpenChange={mockOnOpenChange} refetch={mockRefetch} hotelId="1" />);

      // Trigger save without making any changes
      const saveButton = screen.getByTestId('edit-hotel-modal-save');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(mockOnOpenChange).toHaveBeenCalledWith(false);
      });
    });
  });
});
