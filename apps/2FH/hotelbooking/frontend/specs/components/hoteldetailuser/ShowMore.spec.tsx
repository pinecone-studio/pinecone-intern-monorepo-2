import { fireEvent, render, screen } from '@testing-library/react';
import { ShowMore } from '@/components/hoteldetail/ShowMore';
import { GetRoomsDocument } from '@/generated';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import '@testing-library/jest-dom';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} alt="" />,
}));

// Mock PriceDetail component to avoid Dialog/portal issues
jest.mock('@/components/hoteldetail/PriceDetail', () => ({
  PriceDetail: ({ open }: { open: boolean }) => (open ? <div data-testid="price-detail">Price Detail Mock</div> : null),
}));

// Mock ReserveButton component to avoid useRouter issues
jest.mock('@/components/hoteldetail/ReserveButton', () => ({
  ReserveButton: ({ roomId }: { roomId: string }) => <button data-testid={`reserve-button-${roomId}`}>Reserve</button>,
}));

const mockRoom = {
  id: '1',
  hotelId: '1',
  name: 'Room 1',
  imageURL: ['img1.jpg', 'img2.jpg', 'img3.jpg'],
  pricePerNight: 1000,
  typePerson: 'Single',
  roomInformation: ['wifi', 'tv'],
  bathroom: ['shower'],
  accessibility: ['wheelchair'],
  internet: ['free_wifi'], // Added missing internet property
  foodAndDrink: ['breakfast'],
  bedRoom: ['king_bed'],
  other: ['balcony'],
  entertainment: ['tv'],
  bedNumber: 1,
  createdAt: '',
  updatedAt: '',
};

const getRoomsMock: MockedResponse = {
  request: {
    query: GetRoomsDocument,
    variables: { hotelId: '1' },
  },
  result: {
    data: { getRooms: [mockRoom] },
  },
};

describe('ShowMore carousel', () => {
  const mockOnOpenChange = jest.fn();

  beforeEach(() => {
    mockOnOpenChange.mockClear();
  });

  it('should render first image initially', () => {
    render(
      <MockedProvider mocks={[getRoomsMock]} addTypename={false}>
        <ShowMore open={true} onOpenChange={mockOnOpenChange} rooms={mockRoom} />
      </MockedProvider>
    );

    const image = screen.getByTestId('room-info-item-image');
    expect(image).toHaveAttribute('src', 'img1.jpg');
  });

  it('should go to next image when clicking next', () => {
    render(
      <MockedProvider mocks={[getRoomsMock]} addTypename={false}>
        <ShowMore open={true} onOpenChange={mockOnOpenChange} rooms={mockRoom} />
      </MockedProvider>
    );

    // Find the next button by clicking on the right arrow
    const nextButton = screen.getByText('', { selector: '.absolute.right-3' });
    fireEvent.click(nextButton);

    const image = screen.getByTestId('room-info-item-image');
    expect(image).toHaveAttribute('src', 'img2.jpg');
  });

  it('should wrap to first image from last when clicking next', () => {
    render(
      <MockedProvider mocks={[getRoomsMock]} addTypename={false}>
        <ShowMore open={true} onOpenChange={mockOnOpenChange} rooms={mockRoom} />
      </MockedProvider>
    );

    // Click next button multiple times to go to last image and then wrap to first
    const nextButton = screen.getByText('', { selector: '.absolute.right-3' });
    fireEvent.click(nextButton); // img1 -> img2
    fireEvent.click(nextButton); // img2 -> img3
    fireEvent.click(nextButton); // img3 -> img1 (wrap around)

    const image = screen.getByTestId('room-info-item-image');
    expect(image).toHaveAttribute('src', 'img1.jpg');
  });

  it('should go to previous image when clicking prev', () => {
    render(
      <MockedProvider mocks={[getRoomsMock]} addTypename={false}>
        <ShowMore open={true} onOpenChange={mockOnOpenChange} rooms={mockRoom} />
      </MockedProvider>
    );

    const nextButton = screen.getByText('', { selector: '.absolute.right-3' });
    fireEvent.click(nextButton); // img1 -> img2

    const prevButton = screen.getByText('', { selector: '.absolute.left-3' });
    fireEvent.click(prevButton); // img2 -> img1

    const image = screen.getByTestId('room-info-item-image');
    expect(image).toHaveAttribute('src', 'img1.jpg');
  });

  it('should wrap to last image from first when clicking prev', () => {
    render(
      <MockedProvider mocks={[getRoomsMock]} addTypename={false}>
        <ShowMore open={true} onOpenChange={mockOnOpenChange} rooms={mockRoom} />
      </MockedProvider>
    );

    const prevButton = screen.getByText('', { selector: '.absolute.left-3' });
    fireEvent.click(prevButton); // img1 -> img3 (wrap around)

    const image = screen.getByTestId('room-info-item-image');
    expect(image).toHaveAttribute('src', 'img3.jpg');
  });

  it('should open price detail when clicking price detail button', () => {
    render(
      <MockedProvider mocks={[getRoomsMock]} addTypename={false}>
        <ShowMore open={true} onOpenChange={mockOnOpenChange} rooms={mockRoom} />
      </MockedProvider>
    );

    const priceDetailButton = screen.getByTestId('price-detail-button-show-more');
    fireEvent.click(priceDetailButton);

    expect(screen.queryByTestId('price-detail-button-show-more')).not.toBeInTheDocument();
  });

  it('should open price detail when clicking price detail button in show more', () => {
    render(
      <MockedProvider mocks={[getRoomsMock]} addTypename={false}>
        <ShowMore open={true} onOpenChange={mockOnOpenChange} rooms={mockRoom} />
      </MockedProvider>
    );

    const priceDetailButton = screen.getByTestId('price-detail-button-show-more');
    fireEvent.click(priceDetailButton);

    expect(screen.queryByTestId('price-detail-button-show-more')).not.toBeInTheDocument();
  });
});
