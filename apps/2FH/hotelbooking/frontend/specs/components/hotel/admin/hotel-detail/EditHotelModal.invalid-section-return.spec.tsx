import { render, screen } from '@/TestUtils';
import { EditHotelModal } from '../../../../../src/components/admin/hotel-detail/EditHotelModal';

const mockHotel = {
  id: '1',
  name: 'Test Hotel',
  description: 'Test Description',
  phone: '123-456-7890',
  city: 'Test City',
  country: 'Test Country',
  location: 'Test Location',
  stars: 4,
  rating: 8.5,
  amenities: ['WIFI', 'POOL'],
  languages: ['English', 'Spanish'],
  policies: [],
  faq: [],
  images: [],
  optionalExtras: [],
};

const mockRefetch = jest.fn();

describe('EditHotelModal Invalid Section Return', () => {
  it('returns null when an invalid section is provided to cover line 132', () => {
    render(<EditHotelModal isOpen={true} onOpenChange={jest.fn()} section="invalid-section" hotel={mockHotel} refetch={mockRefetch} hotelId="1" />);

    // The component should render without crashing
    expect(screen.getByTestId('edit-hotel-modal')).toBeInTheDocument();

    // The title should show the fallback "Edit Hotel" when section is invalid
    expect(screen.getByTestId('edit-hotel-modal-title')).toHaveTextContent('Edit Edit Hotel');

    // The content area should be empty since getSectionComponent returns null
    const contentArea = screen.getByTestId('edit-hotel-modal-content');
    expect(contentArea).toBeInTheDocument();
    expect(contentArea.children.length).toBe(0);
  });

  it('handles undefined section gracefully', () => {
    render(<EditHotelModal isOpen={true} onOpenChange={jest.fn()} section={undefined as any} hotel={mockHotel} refetch={mockRefetch} hotelId="1" />);

    // The component should render without crashing
    expect(screen.getByTestId('edit-hotel-modal')).toBeInTheDocument();

    // The title should show the fallback "Edit Hotel"
    expect(screen.getByTestId('edit-hotel-modal-title')).toHaveTextContent('Edit Edit Hotel');
  });

  it('handles null section gracefully', () => {
    render(<EditHotelModal isOpen={true} onOpenChange={jest.fn()} section={null as any} hotel={mockHotel} refetch={mockRefetch} hotelId="1" />);

    // The component should render without crashing
    expect(screen.getByTestId('edit-hotel-modal')).toBeInTheDocument();

    // The title should show the fallback "Edit Hotel"
    expect(screen.getByTestId('edit-hotel-modal-title')).toHaveTextContent('Edit Edit Hotel');
  });

  it('handles empty string section gracefully', () => {
    render(<EditHotelModal isOpen={true} onOpenChange={jest.fn()} section="" hotel={mockHotel} refetch={mockRefetch} hotelId="1" />);

    // The component should render without crashing
    expect(screen.getByTestId('edit-hotel-modal')).toBeInTheDocument();

    // The title should show the fallback "Edit Hotel"
    expect(screen.getByTestId('edit-hotel-modal-title')).toHaveTextContent('Edit Edit Hotel');
  });
});
