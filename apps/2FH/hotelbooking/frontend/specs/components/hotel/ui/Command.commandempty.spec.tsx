import React from 'react';
import { render, screen } from '@/TestUtils';
import { Command, CommandList, CommandEmpty } from '../../../../src/components/ui/Command';

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

  describe('CommandEmpty', () => {
    it('renders CommandEmpty with children', () => {
      render(
        <Command>
          <CommandList>
            <CommandEmpty>
              <div>No results found</div>
            </CommandEmpty>
          </CommandList>
        </Command>
      );

      expect(screen.getByText('No results found')).toBeInTheDocument();
    });

    it('renders CommandEmpty with custom className', () => {
      render(
        <Command>
          <CommandList>
            <CommandEmpty className="custom-empty-class">
              <div>No results found</div>
            </CommandEmpty>
          </CommandList>
        </Command>
      );

      const emptyElement = screen.getByText('No results found').closest('[cmdk-empty]');
      expect(emptyElement).toHaveClass('custom-empty-class');
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <Command>
          <CommandList>
            <CommandEmpty ref={ref}>
              <div>No results found</div>
            </CommandEmpty>
          </CommandList>
        </Command>
      );

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });
});
