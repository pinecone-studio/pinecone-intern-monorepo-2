import React from 'react';
import { render, screen } from '@/TestUtils';
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

describe('FilterControls', () => {
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

  describe('FilterControls - Part 2', () => {
    it('has search icon in search input', () => {
      render(<FilterControls {...mockProps} />);

      const searchIcon = screen.getByTestId('search-icon');
      expect(searchIcon).toBeInTheDocument();
    });

    it('applies correct CSS classes', () => {
      render(<FilterControls {...mockProps} />);

      const container = screen.getByTestId('filter-controls-container');
      expect(container).toHaveClass('flex gap-2 mb-4 w-full');

      const searchContainer = screen.getByTestId('search-container');
      expect(searchContainer).toHaveClass('relative flex-1');

      const filtersContainer = screen.getByTestId('filters-container');
      expect(filtersContainer).toHaveClass('flex gap-2');
    });

    it('handles empty location options', () => {
      const propsWithEmptyOptions = {
        ...mockProps,
        locationOptions: [],
      };

      render(<FilterControls {...propsWithEmptyOptions} />);

      // Should still render the location select with "All Locations" placeholder
      expect(screen.getByText('All Locations')).toBeInTheDocument();
    });

    it('handles all filter values being set', () => {
      const propsWithValues = {
        ...mockProps,
        searchTerm: 'test search',
        location: 'new-york',
        rooms: 'double',
        starRating: '4',
        userRating: '8+',
      };

      render(<FilterControls {...propsWithValues} />);

      expect(screen.getByPlaceholderText('Search hotels by name...')).toHaveValue('test search');
      expect(screen.getAllByText('New York')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Double Room')[0]).toBeInTheDocument();
      expect(screen.getAllByText('4 Stars')[0]).toBeInTheDocument();
      expect(screen.getAllByText('8+ / 10')[0]).toBeInTheDocument();
    });

    it('renders correct room options structure', () => {
      render(<FilterControls {...mockProps} />);

      // The room options should be defined in the component
      // We can verify the structure by checking that the SearchableSelect is rendered
      expect(screen.getAllByText('All Rooms')[0]).toBeInTheDocument();
    });

    it('renders correct star rating options structure', () => {
      render(<FilterControls {...mockProps} />);

      // The star rating options should be defined in the component
      expect(screen.getAllByText('Select Star Rating')[0]).toBeInTheDocument();
    });

    it('renders correct user rating options structure', () => {
      render(<FilterControls {...mockProps} />);

      // The user rating options should be defined in the component
      expect(screen.getAllByText('Select User Rating')[0]).toBeInTheDocument();
    });
  });
});
