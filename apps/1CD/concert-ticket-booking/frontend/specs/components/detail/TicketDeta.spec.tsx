import { render, screen, fireEvent } from '@testing-library/react';
import TicketDetail from '@/components/detail/TicketDetail';
import { Event } from '@/generated';
import '@testing-library/jest-dom';

const mockEvent: Event = {
  _id: '1',
  name: 'Sample Event',
  description: 'Event Description',
  scheduledDays: ['2024-06-10', '2024-06-11'],
  products: [
    {
      _id: 'product1',
      scheduledDay: '2024-06-10',
      ticketType: [
        {
          _id: 'ticket1',
          zoneName: 'VIP',
          totalQuantity: '100',
          soldQuantity: '30',
          discount: '10',
          unitPrice: '50000',
        },
      ],
    },
    {
      _id: 'product2',
      scheduledDay: '2024-06-11',
      ticketType: [
        {
          _id: 'ticket2',
          zoneName: 'General Admission',
          totalQuantity: '200',
          soldQuantity: '50',
          discount: '0',
          unitPrice: '30000',
        },
      ],
    },
  ],
  guestArtists: [],
  mainArtists: [],
  category: [],
  discount: 0,
  priority: 'medium',
  venue: {
    _id: 'venue1',
    name: 'Sample Venue',
    location: 'Sample Location',
    image: '',
    capacity: '1000',
    size: '1000 sqm',
  },
  image: '',
};

describe('TicketDetail Component', () => {
  it('renders without crashing', () => {
    render(<TicketDetail event={mockEvent} />);
    expect(screen.getByText('Тоглолт үзэх өдрөө сонгоно уу.')).toBeInTheDocument();
  });

  it('displays the default selected day and products', () => {
    render(<TicketDetail event={mockEvent} />);
    expect(screen.getByText('Сонгосон өдөр: 06.10')).toBeInTheDocument();
    expect(screen.getByText('VIP')).toBeInTheDocument();
    expect(screen.getByText('45000₮')).toBeInTheDocument(); // Discounted price
    expect(screen.getByText('50000₮')).toBeInTheDocument(); // Original price
  });

  it('changes the selected day and updates products', () => {
    render(<TicketDetail event={mockEvent} />);
    const button = screen.getByText('Сонгосон өдөр: 06.10');
    fireEvent.click(button);

    const newDay = screen.getByText('06.11');
    fireEvent.click(newDay);

    expect(screen.getByText('Сонгосон өдөр: 06.11')).toBeInTheDocument();
    expect(screen.getByText('General Admission')).toBeInTheDocument();
    expect(screen.getByText('30000₮')).toBeInTheDocument();
  });

  it('displays a message when there are no tickets for the selected day', () => {
    const noTicketsEvent = {
      ...mockEvent,
      products: [],
    };
    render(<TicketDetail event={noTicketsEvent} />);
    expect(screen.getByText('Энэ өдрийн тасалбарууд байхгүй байна.')).toBeInTheDocument();
  });
});
