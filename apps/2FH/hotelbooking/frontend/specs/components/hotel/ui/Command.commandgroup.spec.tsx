import React from 'react';
import { render, screen } from '@/TestUtils';
import { Command, CommandList, CommandGroup } from '../../../../src/components/ui/Command';

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

  describe('CommandGroup', () => {
    it('renders CommandGroup with children', () => {
      render(
        <Command>
          <CommandList>
            <CommandGroup>
              <div>Group content</div>
            </CommandGroup>
          </CommandList>
        </Command>
      );

      expect(screen.getByText('Group content')).toBeInTheDocument();
    });

    it('renders CommandGroup with custom className', () => {
      render(
        <Command>
          <CommandList>
            <CommandGroup className="custom-group-class">
              <div>Group content</div>
            </CommandGroup>
          </CommandList>
        </Command>
      );

      const groupElement = screen.getByText('Group content').closest('[cmdk-group]');
      expect(groupElement).toHaveClass('custom-group-class');
    });

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <Command>
          <CommandList>
            <CommandGroup ref={ref}>
              <div>Group content</div>
            </CommandGroup>
          </CommandList>
        </Command>
      );

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });
});
