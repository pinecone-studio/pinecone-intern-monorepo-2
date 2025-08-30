import React from 'react';
import { render, screen } from '@/TestUtils';
import { Command, CommandList, CommandItem, CommandShortcut } from '../../../../src/components/ui/Command';

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

  describe('CommandShortcut', () => {
    it('renders CommandShortcut with children', () => {
      render(
        <Command>
          <CommandList>
            <CommandItem>
              <span>Item</span>
              <CommandShortcut>
                <span>⌘K</span>
              </CommandShortcut>
            </CommandItem>
          </CommandList>
        </Command>
      );

      expect(screen.getByText('⌘K')).toBeInTheDocument();
    });

    it('renders CommandShortcut with custom className', () => {
      render(
        <Command>
          <CommandList>
            <CommandItem>
              <span>Item</span>
              <CommandShortcut className="custom-shortcut-class">
                <span>⌘K</span>
              </CommandShortcut>
            </CommandItem>
          </CommandList>
        </Command>
      );

      const shortcutElement = screen.getByText('⌘K').parentElement;
      expect(shortcutElement).toHaveClass('custom-shortcut-class');
    });

    it('renders with default styling', () => {
      render(
        <Command>
          <CommandList>
            <CommandItem>
              <span>Item</span>
              <CommandShortcut>
                <span>⌘K</span>
              </CommandShortcut>
            </CommandItem>
          </CommandList>
        </Command>
      );

      const shortcutElement = screen.getByText('⌘K').parentElement;
      expect(shortcutElement).toHaveClass('ml-auto', 'text-xs', 'tracking-widest', 'text-muted-foreground');
    });
  });
});
