import React from 'react';
import { render, screen, fireEvent } from '@/TestUtils';
import { FilterControls } from '@/components/admin/FilterControls';

jest.mock('@/components/ui/command', () => ({
  Command: ({ children }: { children: React.ReactNode }) => <div data-testid="command">{children}</div>,
  CommandEmpty: ({ children }: { children: React.ReactNode }) => <div data-testid="command-empty">{children}</div>,
  CommandGroup: ({ children }: { children: React.ReactNode }) => <div data-testid="command-group">{children}</div>,
  CommandInput: ({ placeholder }: { placeholder: string }) => <input data-testid="command-input" placeholder={placeholder} />,
  CommandItem: ({ children, value, onSelect }: { children: React.ReactNode; value: string; onSelect: (_value: string) => void }) => (
    <div data-testid={`command-item-${value}`} onClick={() => onSelect(value)}>
      {children}
    </div>
  ),
  CommandList: ({ children }: { children: React.ReactNode }) => <div data-testid="command-list">{children}</div>,
}));

// Mock the Popover components
jest.mock('@/components/ui/popover', () => ({
  Popover: ({ children, open, _onOpenChange }: { children: React.ReactNode; open: boolean; onOpenChange: (_open: boolean) => void }) => (
    <div data-testid="popover" data-open={open}>
      {children}
    </div>
  ),
  PopoverContent: ({ children }: { children: React.ReactNode }) => <div data-testid="popover-content">{children}</div>,
  PopoverTrigger: ({ children, asChild: _asChild }: { children: React.ReactNode; asChild?: boolean }) => (
    <div
      data-testid="popover-trigger"
      onClick={() => {
        /* empty function for testing */
      }}
    >
      {children}
    </div>
  ),
}));

describe('FilterControls - Part 1', () => {
  const mockProps = {
    searchTerm: '',
    setSearchTerm: jest.fn(),
    location: '',
    setLocation: jest.fn(),
    rooms: '',
    setRooms: jest.fn(),
    starRating: '',
    setStarRating: jest.fn(),
    userRating: '',
    setUserRating: jest.fn(),
    locationOptions: [
      { value: 'new-york', label: 'New York' },
      { value: 'london', label: 'London' },
      { value: 'paris', label: 'Paris' },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all filter controls', () => {
    render(<FilterControls {...mockProps} />);

    expect(screen.getByPlaceholderText('Search hotels by name...')).toBeInTheDocument();
    expect(screen.getAllByText('All Locations')[0]).toBeInTheDocument();
    expect(screen.getAllByText('All Rooms')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Select Star Rating')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Select User Rating')[0]).toBeInTheDocument();
  });

  it('displays search term value', () => {
    render(<FilterControls {...mockProps} searchTerm="test search" />);

    const searchInput = screen.getByPlaceholderText('Search hotels by name...');
    expect(searchInput).toHaveValue('test search');
  });

  it('calls setSearchTerm when search input changes', () => {
    render(<FilterControls {...mockProps} />);

    const searchInput = screen.getByPlaceholderText('Search hotels by name...');
    fireEvent.change(searchInput, { target: { value: 'new search' } });

    expect(mockProps.setSearchTerm).toHaveBeenCalledWith('new search');
  });

  it('displays selected location', () => {
    render(<FilterControls {...mockProps} location="new-york" />);

    expect(screen.getAllByText('New York')[0]).toBeInTheDocument();
  });

  it('displays selected room type', () => {
    render(<FilterControls {...mockProps} rooms="single" />);

    expect(screen.getAllByText('Single Room')[0]).toBeInTheDocument();
  });

  it('displays selected star rating', () => {
    render(<FilterControls {...mockProps} starRating="4" />);

    // Use getAllByText and check the first one (the button)
    const starRatingElements = screen.getAllByText('4 Stars');
    expect(starRatingElements[0]).toBeInTheDocument();
  });

  it('displays selected user rating', () => {
    render(<FilterControls {...mockProps} userRating="8+" />);

    // Use getAllByText and check the first one (the button)
    const userRatingElements = screen.getAllByText('8+ / 10');
    expect(userRatingElements[0]).toBeInTheDocument();
  });

  it('renders all SearchableSelect components', () => {
    render(<FilterControls {...mockProps} />);

    // Check that all SearchableSelect components are rendered
    expect(screen.getAllByTestId('popover')).toHaveLength(4); // location, rooms, starRating, userRating
  });
});
