import React from 'react';
import { render, screen } from '@/TestUtils';
import { Command, CommandList, CommandSeparator } from '../../../../src/components/ui/Command';

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

  describe('CommandSeparator', () => {
    it('renders CommandSeparator', () => {
      render(
        <Command>
          <CommandList>
            <CommandSeparator />
          </CommandList>
        </Command>
      );

      const separator = screen.getByRole('separator');
      expect(separator).toBeInTheDocument();
    });

    it('renders CommandSeparator with custom className', () => {
      render(
        <Command>
          <CommandList>
            <CommandSeparator className="custom-separator-class" />
          </CommandList>
        </Command>
      );

      const separator = screen.getByRole('separator');
      expect(separator).toHaveClass('custom-separator-class');
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <Command>
          <CommandList>
            <CommandSeparator ref={ref} />
          </CommandList>
        </Command>
      );

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });
});
