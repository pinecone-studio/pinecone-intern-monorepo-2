import { render, screen } from '@/TestUtils';
import { Dialog, DialogDescription } from '../../../../src/components/ui/Dialog';

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
  describe('DialogDescription', () => {
    it('renders dialog description with default styling', () => {
      render(<DialogDescription>Description content</DialogDescription>);
      expect(screen.getByTestId('dialog-description')).toBeInTheDocument();
      expect(screen.getByText('Description content')).toBeInTheDocument();
    });

    it('renders dialog description with custom className', () => {
      render(<DialogDescription className="custom-description">Description content</DialogDescription>);
      const description = screen.getByTestId('dialog-description');
      expect(description).toHaveClass('custom-description');
    });

    it('renders description content correctly', () => {
      render(<DialogDescription>Description content</DialogDescription>);
      expect(screen.getByText('Description content')).toBeInTheDocument();
    });
  });
});
