import React from 'react';
import { render, screen } from '@/TestUtils';
import { Command, CommandList } from '../../../../src/components/ui/Command';

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

  describe('CommandList', () => {
    it('renders CommandList with children', () => {
      render(
        <Command>
          <CommandList>
            <div>List content</div>
          </CommandList>
        </Command>
      );

      expect(screen.getByText('List content')).toBeInTheDocument();
    });

    it('renders CommandList with custom className', () => {
      render(
        <Command>
          <CommandList className="custom-list-class">
            <div>List content</div>
          </CommandList>
        </Command>
      );

      const listElement = screen.getByText('List content').closest('[cmdk-list]');
      expect(listElement).toHaveClass('custom-list-class');
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <Command>
          <CommandList ref={ref}>
            <div>List content</div>
          </CommandList>
        </Command>
      );

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });
});
