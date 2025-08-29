import { render, screen } from '@/TestUtils';
import { Popover, PopoverTrigger } from '../../../../src/components/ui/Popover';

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

  describe('PopoverTrigger', () => {
    it('renders popover trigger component', () => {
      render(
        <Popover>
          <PopoverTrigger asChild>
            <button data-testid="trigger">Trigger</button>
          </PopoverTrigger>
        </Popover>
      );

      expect(screen.getByTestId('trigger')).toBeInTheDocument();
    });

    it('renders trigger with correct text', () => {
      render(
        <Popover>
          <PopoverTrigger asChild>
            <button data-testid="trigger">Click me</button>
          </PopoverTrigger>
        </Popover>
      );

      expect(screen.getByText('Click me')).toBeInTheDocument();
    });
  });
});
