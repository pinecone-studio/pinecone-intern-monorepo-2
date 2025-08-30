import { render, screen } from '@/TestUtils';
import { Dialog, DialogFooter } from '../../../../src/components/ui/Dialog';

jest.mock('@radix-ui/react-dialog', () => ({
  Root: ({ children, open, onOpenChange }: any) => (
    <div data-testid="dialog-root" data-open={open} onClick={() => onOpenChange?.(!open)}>
      {children}
    </div>
  ),
  Trigger: ({ children, asChild }: any) => (
    <div data-testid="dialog-trigger" data-as-child={asChild}>
      {children}
    </div>
  ),
  Portal: ({ children }: any) => <div data-testid="dialog-portal">{children}</div>,
  Close: ({ children, className }: any) => (
    <button data-testid="dialog-close" className={className}>
      {children}
    </button>
  ),
  Overlay: ({ className, ...props }: any) => <div data-testid="dialog-overlay" className={className} {...props} />,
  Content: ({ className, children, ...props }: any) => (
    <div data-testid="dialog-content" className={className} {...props}>
      {children}
    </div>
  ),
  Title: ({ className, children, ...props }: any) => (
    <h2 data-testid="dialog-title" className={className} {...props}>
      {children}
    </h2>
  ),
  Description: ({ className, children, ...props }: any) => (
    <p data-testid="dialog-description" className={className} {...props}>
      {children}
    </p>
  ),
}));

describe('Dialog Components', () => {
  describe('Dialog', () => {
    it('renders dialog root', () => {
      render(
        <Dialog>
          <div>Dialog content</div>
        </Dialog>
      );
      expect(screen.getByTestId('dialog-root')).toBeInTheDocument();
    });
  });
  describe('DialogFooter', () => {
    it('renders dialog footer with default styling', () => {
      render(<DialogFooter>Footer content</DialogFooter>);
      expect(screen.getByText('Footer content')).toBeInTheDocument();
    });

    it('renders dialog footer with custom className', () => {
      render(<DialogFooter className="custom-footer">Footer content</DialogFooter>);
      const footer = screen.getByText('Footer content');
      expect(footer).toHaveClass('custom-footer');
    });
  });
});
