import { render, screen } from '@/TestUtils';
import { FAQCard } from '../../../../../src/components/admin/hotel-detail/FaqCard';

const mockRefetch = jest.fn();
const mockSetEditModalState = jest.fn();

describe('FAQCard Null Return Tests', () => {
  it('returns null when hotel.faq is null to cover line 31', () => {
    const mockHotel = {
      id: '1',
      name: 'Test Hotel',
      faq: null,
    };

    const { container } = render(<FAQCard hotel={mockHotel} editModalState={{ isOpen: false, section: 'faq' }} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId="1" />);

    // Should return null (empty container)
    expect(container.firstChild).toBeNull();
  });

  it('returns null when hotel.faq is undefined', () => {
    const mockHotel = {
      id: '1',
      name: 'Test Hotel',
      // faq is undefined
    };

    const { container } = render(<FAQCard hotel={mockHotel} editModalState={{ isOpen: false, section: 'faq' }} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId="1" />);

    // Should return null (empty container)
    expect(container.firstChild).toBeNull();
  });

  it('returns null when hotel.faq is an empty array', () => {
    const mockHotel = {
      id: '1',
      name: 'Test Hotel',
      faq: [],
    };

    const { container } = render(<FAQCard hotel={mockHotel} editModalState={{ isOpen: false, section: 'faq' }} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId="1" />);

    // Should return null (empty container)
    expect(container.firstChild).toBeNull();
  });

  it('renders normally when hotel.faq has content', () => {
    const mockHotel = {
      id: '1',
      name: 'Test Hotel',
      faq: [
        {
          question: 'Test Question',
          answer: 'Test Answer',
        },
      ],
    };

    render(<FAQCard hotel={mockHotel} editModalState={{ isOpen: false, section: 'faq' }} setEditModalState={mockSetEditModalState} refetch={mockRefetch} hotelId="1" />);

    // Should render the FAQ card
    expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
    expect(screen.getByText('Test Question')).toBeInTheDocument();
    expect(screen.getByText('Test Answer')).toBeInTheDocument();
  });
});
