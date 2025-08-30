import { render, screen } from '@/TestUtils';
import { EditHotelModal } from '../../../../../src/components/admin/hotel-detail/EditHotelModal';

const mockRefetch = jest.fn();

describe('EditHotelModal Invalid Section Tests', () => {
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

  describe('Invalid section handling', () => {
    it('handles invalid section prop with fallback title', () => {
      render(<EditHotelModal hotel={mockHotel} section="invalid" as any isOpen={true} onOpenChange={jest.fn()} refetch={mockRefetch} hotelId="1" />);

      // Should render with fallback title "Edit Edit Hotel" (Edit + getSectionTitle())
      expect(screen.getByText('Edit Edit Hotel')).toBeInTheDocument();
    });

    it('handles undefined section prop with fallback title', () => {
      render(<EditHotelModal hotel={mockHotel} section={undefined as any} isOpen={true} onOpenChange={jest.fn()} refetch={mockRefetch} hotelId="1" />);

      // Should render with fallback title "Edit Edit Hotel" (Edit + getSectionTitle())
      expect(screen.getByText('Edit Edit Hotel')).toBeInTheDocument();
    });

    it('handles null section prop with fallback title', () => {
      render(<EditHotelModal hotel={mockHotel} section={null as any} isOpen={true} onOpenChange={jest.fn()} refetch={mockRefetch} hotelId="1" />);

      // Should render with fallback title "Edit Edit Hotel" (Edit + getSectionTitle())
      expect(screen.getByText('Edit Edit Hotel')).toBeInTheDocument();
    });

    it('handles empty string section prop with fallback title', () => {
      render(<EditHotelModal hotel={mockHotel} section="" as any isOpen={true} onOpenChange={jest.fn()} refetch={mockRefetch} hotelId="1" />);

      // Should render with fallback title "Edit Edit Hotel" (Edit + getSectionTitle())
      expect(screen.getByText('Edit Edit Hotel')).toBeInTheDocument();
    });

    it('handles random string section prop with fallback title', () => {
      render(<EditHotelModal hotel={mockHotel} section="random_section" as any isOpen={true} onOpenChange={jest.fn()} refetch={mockRefetch} hotelId="1" />);

      // Should render with fallback title "Edit Edit Hotel" (Edit + getSectionTitle())
      expect(screen.getByText('Edit Edit Hotel')).toBeInTheDocument();
    });

    it('handles invalid section with null component fallback', () => {
      render(<EditHotelModal hotel={mockHotel} section="invalid" as any isOpen={true} onOpenChange={jest.fn()} refetch={mockRefetch} hotelId="1" />);

      // Should render the modal content area but with no specific section component
      expect(screen.getByTestId('edit-hotel-modal-content')).toBeInTheDocument();

      // The modal should still be functional with fallback behavior
      expect(screen.getByTestId('edit-hotel-modal')).toBeInTheDocument();
      expect(screen.getByTestId('edit-hotel-modal-cancel')).toBeInTheDocument();
      expect(screen.getByTestId('edit-hotel-modal-save')).toBeInTheDocument();
    });
  });
});
