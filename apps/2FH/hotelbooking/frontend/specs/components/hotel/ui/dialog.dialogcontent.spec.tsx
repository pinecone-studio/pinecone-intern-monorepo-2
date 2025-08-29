import { render, screen } from '@/TestUtils';
import { Dialog, DialogContent } from '../../../../src/components/ui/Dialog';

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
  describe('DialogContent', () => {
    it('renders dialog content', () => {
      render(
        <DialogContent>
          <div>Content</div>
        </DialogContent>
      );
      expect(screen.getByTestId('dialog-content')).toBeInTheDocument();
      expect(screen.getByTestId('dialog-portal')).toBeInTheDocument();
      expect(screen.getByTestId('dialog-overlay')).toBeInTheDocument();
    });

    it('renders dialog content with custom className', () => {
      render(
        <DialogContent className="custom-content">
          <div>Content</div>
        </DialogContent>
      );
      expect(screen.getByTestId('dialog-content')).toHaveClass('custom-content');
    });

    it('renders content correctly', () => {
      render(
        <DialogContent>
          <div>Content</div>
        </DialogContent>
      );
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('renders close button', () => {
      render(
        <DialogContent>
          <div>Content</div>
        </DialogContent>
      );
      expect(screen.getByTestId('dialog-close')).toBeInTheDocument();
    });
  });
});
