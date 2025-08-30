import { render, screen } from '@/TestUtils';
import { FAQCard } from '../../../../../src/components/admin/hotel-detail/FaqCard';

const mockRefetch = jest.fn();
const mockSetEditModalState = jest.fn();

describe('FAQCard Edge Cases', () => {
  it('returns null when hotel has no faq property to cover line 31', () => {
    const mockHotel = {
      id: '1',
      name: 'Test Hotel',
      description: 'Test Description',
      // faq property is missing
    };

    const { container } = render(
      <FAQCard
        hotel={mockHotel}
        editModalState={{ isOpen: false, section: 'faq' }}
        setEditModalState={mockSetEditModalState}
        refetch={mockRefetch}
        hotelId="1"
      />
    );

    // Should return null, so container should be empty
    expect(container.firstChild).toBeNull();
  });

  it('returns null when hotel has empty faq array', () => {
    const mockHotel = {
      id: '1',
      name: 'Test Hotel',
      description: 'Test Description',
      faq: [],
    };

    const { container } = render(
      <FAQCard
        hotel={mockHotel}
        editModalState={{ isOpen: false, section: 'faq' }}
        setEditModalState={mockSetEditModalState}
        refetch={mockRefetch}
        hotelId="1"
      />
    );

    // Should return null, so container should be empty
    expect(container.firstChild).toBeNull();
  });

  it('returns null when hotel has null faq', () => {
    const mockHotel = {
      id: '1',
      name: 'Test Hotel',
      description: 'Test Description',
      faq: null,
    };

    const { container } = render(
      <FAQCard
        hotel={mockHotel}
        editModalState={{ isOpen: false, section: 'faq' }}
        setEditModalState={mockSetEditModalState}
        refetch={mockRefetch}
        hotelId="1"
      />
    );

    // Should return null, so container should be empty
    expect(container.firstChild).toBeNull();
  });

  it('returns null when hotel has undefined faq', () => {
    const mockHotel = {
      id: '1',
      name: 'Test Hotel',
      description: 'Test Description',
      faq: undefined,
    };

    const { container } = render(
      <FAQCard
        hotel={mockHotel}
        editModalState={{ isOpen: false, section: 'faq' }}
        setEditModalState={mockSetEditModalState}
        refetch={mockRefetch}
        hotelId="1"
      />
    );

    // Should return null, so container should be empty
    expect(container.firstChild).toBeNull();
  });

  it('renders normally when hotel has valid faq data', () => {
    const mockHotel = {
      id: '1',
      name: 'Test Hotel',
      description: 'Test Description',
      faq: [
        {
          question: 'What time is check-in?',
          answer: 'Check-in is available from 2:00 PM',
        },
      ],
    };

    render(
      <FAQCard
        hotel={mockHotel}
        editModalState={{ isOpen: false, section: 'faq' }}
        setEditModalState={mockSetEditModalState}
        refetch={mockRefetch}
        hotelId="1"
      />
    );

    // Should render the FAQ card
    expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
    expect(screen.getByText('What time is check-in?')).toBeInTheDocument();
    expect(screen.getByText('Check-in is available from 2:00 PM')).toBeInTheDocument();
  });
});
