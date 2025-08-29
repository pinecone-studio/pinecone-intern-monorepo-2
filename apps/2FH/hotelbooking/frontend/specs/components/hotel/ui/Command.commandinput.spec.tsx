import React from 'react';
import { render, screen } from '@/TestUtils';
import { Command, CommandInput } from '../../../../src/components/ui/Command';

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

  describe('CommandInput', () => {
    it('renders CommandInput with placeholder', () => {
      render(
        <Command>
          <CommandInput placeholder="Search..." />
        </Command>
      );

      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('renders CommandInput with custom className', () => {
      render(
        <Command>
          <CommandInput className="custom-input-class" />
        </Command>
      );

      const input = screen.getByRole('combobox');
      expect(input).toHaveClass('custom-input-class');
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLInputElement>();
      render(
        <Command>
          <CommandInput ref={ref} />
        </Command>
      );

      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it('renders input element correctly', () => {
      render(
        <Command>
          <CommandInput placeholder="Search..." />
        </Command>
      );

      const input = screen.getByPlaceholderText('Search...');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('placeholder', 'Search...');
    });
  });
});
