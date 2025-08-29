import React from 'react';
import { render, screen } from '@/TestUtils';
import { Command } from '../../../../src/components/ui/Command';

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

  it('renders Command with custom className', () => {
    render(
      <Command className="custom-class">
        <div>Test content</div>
      </Command>
    );

    const commandElement = screen.getByText('Test content').closest('[cmdk-root]');
    expect(commandElement).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <Command ref={ref}>
        <div>Test content</div>
      </Command>
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
