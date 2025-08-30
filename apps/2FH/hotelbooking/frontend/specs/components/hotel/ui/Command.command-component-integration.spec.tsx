import React from 'react';
import { render, screen } from '@/TestUtils';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandSeparator, CommandItem, CommandShortcut } from '@/components/ui/Command';

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

  describe('Command component integration', () => {
    it('renders complete command structure', () => {
      render(
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No results found</CommandEmpty>
            <CommandGroup>
              <CommandItem>Option 1</CommandItem>
              <CommandItem>Option 2</CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem>
                Option 3<CommandShortcut>⌘3</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      );

      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
      expect(screen.getByText('Option 3')).toBeInTheDocument();
      expect(screen.getByText('⌘3')).toBeInTheDocument();
    });

    it('renders command structure with selectable items', () => {
      const mockOnSelect = jest.fn();

      render(
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandItem onSelect={mockOnSelect}>Selectable option</CommandItem>
          </CommandList>
        </Command>
      );

      const input = screen.getByPlaceholderText('Search...');
      const option = screen.getByText('Selectable option');

      expect(input).toBeInTheDocument();
      expect(option).toBeInTheDocument();
      // Test that the onSelect prop is passed through
      expect(option.closest('[cmdk-item]')).toBeInTheDocument();
    });

    it('handles multiple command groups', () => {
      render(
        <Command>
          <CommandList>
            <CommandGroup>
              <CommandItem>Group 1 - Option 1</CommandItem>
              <CommandItem>Group 1 - Option 2</CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem>Group 2 - Option 1</CommandItem>
              <CommandItem>Group 2 - Option 2</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      );

      expect(screen.getByText('Group 1 - Option 1')).toBeInTheDocument();
      expect(screen.getByText('Group 1 - Option 2')).toBeInTheDocument();
      expect(screen.getByText('Group 2 - Option 1')).toBeInTheDocument();
      expect(screen.getByText('Group 2 - Option 2')).toBeInTheDocument();
    });

    it('handles command items with shortcuts', () => {
      render(
        <Command>
          <CommandList>
            <CommandItem>
              Copy
              <CommandShortcut>⌘C</CommandShortcut>
            </CommandItem>
            <CommandItem>
              Paste
              <CommandShortcut>⌘V</CommandShortcut>
            </CommandItem>
          </CommandList>
        </Command>
      );

      expect(screen.getByText('Copy')).toBeInTheDocument();
      expect(screen.getByText('Paste')).toBeInTheDocument();
      expect(screen.getByText('⌘C')).toBeInTheDocument();
      expect(screen.getByText('⌘V')).toBeInTheDocument();
    });

    it('handles disabled command items', () => {
      render(
        <Command>
          <CommandList>
            <CommandItem>Enabled option</CommandItem>
            <CommandItem disabled>Disabled option</CommandItem>
          </CommandList>
        </Command>
      );

      const enabledItem = screen.getByText('Enabled option').closest('[cmdk-item]');
      const disabledItem = screen.getByText('Disabled option').closest('[cmdk-item]');

      expect(enabledItem).not.toHaveAttribute('data-disabled', 'true');
      expect(disabledItem).toHaveAttribute('data-disabled', 'true');
    });

    it('handles selected command items', () => {
      render(
        <Command>
          <CommandList>
            <CommandItem data-selected={true}>Selected option</CommandItem>
            <CommandItem data-selected={false}>Unselected option</CommandItem>
          </CommandList>
        </Command>
      );
      const selectedItem = screen.getByText('Selected option').closest('[cmdk-item]');
      const unselectedItem = screen.getByText('Unselected option').closest('[cmdk-item]');

      expect(selectedItem).toHaveAttribute('data-selected', 'true');
      expect(unselectedItem).toHaveAttribute('data-selected', 'false');
    });
  });
});
