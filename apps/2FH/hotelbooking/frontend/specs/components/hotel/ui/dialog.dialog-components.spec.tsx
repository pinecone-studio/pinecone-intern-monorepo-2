import { render } from '@/TestUtils';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '../../../../src/components/ui/Dialog';

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
  it('should render the dialog', () => {
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  });
});
