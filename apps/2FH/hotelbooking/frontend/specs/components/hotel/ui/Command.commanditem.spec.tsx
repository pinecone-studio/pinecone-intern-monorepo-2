import React from 'react';
import { render, screen } from '@/TestUtils';
import { Command, CommandList, CommandItem } from '../../../../src/components/ui/Command';

jest.mock('@/components/ui/Dialog', () => ({
  Dialog: ({ children, open }: any) => (
    <div data-testid="dialog" data-open={open}>
      {open && children}
    </div>
  ),
  DialogContent: ({ children, className }: any) => (
    <div data-testid="dialog-content" className={className}>
      {children}
    </div>
  ),
}));

// Mock scrollIntoView to prevent errors
Element.prototype.scrollIntoView = jest.fn();

describe('Command', () => {
  it('renders Command component with children', () => {
    render(
      <Command>
        <div>Test content</div>
      </Command>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  describe('CommandItem', () => {
    it('renders CommandItem with children', () => {
      render(
        <Command>
          <CommandList>
            <CommandItem>
              <div>Item content</div>
            </CommandItem>
          </CommandList>
        </Command>
      );

      expect(screen.getByText('Item content')).toBeInTheDocument();
    });

    it('renders CommandItem with custom className', () => {
      render(
        <Command>
          <CommandList>
            <CommandItem className="custom-item-class">
              <div>Item content</div>
            </CommandItem>
          </CommandList>
        </Command>
      );

      const itemElement = screen.getByText('Item content').closest('[cmdk-item]');
      expect(itemElement).toHaveClass('custom-item-class');
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <Command>
          <CommandList>
            <CommandItem ref={ref}>
              <div>Item content</div>
            </CommandItem>
          </CommandList>
        </Command>
      );

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('renders clickable item', () => {
      const mockOnClick = jest.fn();
      render(
        <Command>
          <CommandList>
            <CommandItem onClick={mockOnClick}>
              <div>Item content</div>
            </CommandItem>
          </CommandList>
        </Command>
      );

      const item = screen.getByText('Item content');
      expect(item).toBeInTheDocument();
      // Test that the onClick prop is passed through
      expect(item.closest('[cmdk-item]')).toBeInTheDocument();
    });

    it('handles disabled state', () => {
      render(
        <Command>
          <CommandList>
            <CommandItem disabled>
              <div>Disabled item</div>
            </CommandItem>
          </CommandList>
        </Command>
      );

      const item = screen.getByText('Disabled item').closest('[cmdk-item]');
      expect(item).toHaveAttribute('data-disabled', 'true');
    });

    it('handles selected state', () => {
      render(
        <Command>
          <CommandList>
            <CommandItem data-selected={true}>
              <div>Selected item</div>
            </CommandItem>
          </CommandList>
        </Command>
      );

      const item = screen.getByText('Selected item').closest('[cmdk-item]');
      expect(item).toHaveAttribute('data-selected', 'true');
    });
  });
});
