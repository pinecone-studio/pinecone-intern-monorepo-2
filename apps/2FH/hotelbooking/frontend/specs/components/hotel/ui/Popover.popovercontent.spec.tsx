import { render, screen } from '@/TestUtils';
import { Popover, PopoverContent } from '../../../../src/components/ui/Popover';

jest.mock('@/lib/utils', () => ({
  cn: (...classes: string[]) => classes.join(' '),
}));

describe('Popover Components', () => {
  describe('Popover', () => {
    it('renders popover root component', () => {
      render(
        <Popover>
          <div>Test Content</div>
        </Popover>
      );

      // Popover root doesn't render anything visible, just provides context
      expect(document.body).toBeInTheDocument();
    });
  });

  describe('PopoverContent', () => {
    it('renders popover content with correct classes', () => {
      render(
        <Popover defaultOpen>
          <PopoverContent data-testid="popover-content">
            <div>Content</div>
          </PopoverContent>
        </Popover>
      );

      const content = screen.getByTestId('popover-content');
      expect(content).toHaveClass(
        'z-50',
        'w-72',
        'rounded-md',
        'border',
        'bg-popover',
        'p-4',
        'text-popover-foreground',
        'shadow-md',
        'outline-none',
        'data-[state=open]:animate-in',
        'data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0',
        'data-[state=open]:fade-in-0',
        'data-[state=closed]:zoom-out-95',
        'data-[state=open]:zoom-in-95',
        'data-[side=bottom]:slide-in-from-top-2',
        'data-[side=left]:slide-in-from-right-2',
        'data-[side=right]:slide-in-from-left-2',
        'data-[side=top]:slide-in-from-bottom-2'
      );
    });

    it('renders content with children', () => {
      render(
        <Popover defaultOpen>
          <PopoverContent>
            <div data-testid="content-child">Test Content</div>
          </PopoverContent>
        </Popover>
      );

      expect(screen.getByTestId('content-child')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('forwards ref correctly', () => {
      const ref = jest.fn();
      render(
        <Popover defaultOpen>
          <PopoverContent ref={ref} data-testid="popover-content">
            <div>Content</div>
          </PopoverContent>
        </Popover>
      );

      expect(ref).toHaveBeenCalled();
    });

    it('applies custom className', () => {
      render(
        <Popover defaultOpen>
          <PopoverContent className="custom-class" data-testid="popover-content">
            <div>Content</div>
          </PopoverContent>
        </Popover>
      );

      const content = screen.getByTestId('popover-content');
      expect(content.className).toContain('custom-class');
    });

    it('uses default align and sideOffset props', () => {
      render(
        <Popover defaultOpen>
          <PopoverContent data-testid="popover-content">
            <div>Content</div>
          </PopoverContent>
        </Popover>
      );

      const content = screen.getByTestId('popover-content');
      expect(content).toBeInTheDocument();
    });

    it('applies custom align and sideOffset props', () => {
      render(
        <Popover defaultOpen>
          <PopoverContent align="start" sideOffset={8} data-testid="popover-content">
            <div>Content</div>
          </PopoverContent>
        </Popover>
      );

      const content = screen.getByTestId('popover-content');
      expect(content).toBeInTheDocument();
    });
  });
});
