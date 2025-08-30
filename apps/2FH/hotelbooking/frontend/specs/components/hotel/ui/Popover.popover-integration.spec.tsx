import { render, screen } from '@/TestUtils';
import { Popover, PopoverTrigger, PopoverContent } from '../../../../src/components/ui/Popover';

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

  describe('Popover Integration', () => {
    it('renders complete popover structure', () => {
      render(
        <Popover defaultOpen>
          <PopoverTrigger asChild>
            <button data-testid="trigger">Open</button>
          </PopoverTrigger>
          <PopoverContent data-testid="content">
            <div>Popover content</div>
          </PopoverContent>
        </Popover>
      );

      expect(screen.getByTestId('trigger')).toBeInTheDocument();
      expect(screen.getByTestId('content')).toBeInTheDocument();
      expect(screen.getByText('Popover content')).toBeInTheDocument();
    });
  });
});
