import { render, screen } from '@/TestUtils';
import { Dialog, DialogTitle } from '../../../../src/components/ui/Dialog';

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
  describe('DialogTitle', () => {
    it('renders dialog title with default styling', () => {
      render(<DialogTitle>Title content</DialogTitle>);
      expect(screen.getByTestId('dialog-title')).toBeInTheDocument();
      expect(screen.getByText('Title content')).toBeInTheDocument();
    });

    it('renders dialog title with custom className', () => {
      render(<DialogTitle className="custom-title">Title content</DialogTitle>);
      const title = screen.getByTestId('dialog-title');
      expect(title).toHaveClass('custom-title');
    });

    it('renders title content correctly', () => {
      render(<DialogTitle>Title content</DialogTitle>);
      expect(screen.getByText('Title content')).toBeInTheDocument();
    });
  });
});
