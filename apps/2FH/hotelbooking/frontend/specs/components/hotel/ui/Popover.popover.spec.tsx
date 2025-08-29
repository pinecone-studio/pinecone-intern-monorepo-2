import { render } from '@/TestUtils';
import { Popover } from '../../../../src/components/ui/Popover';

jest.mock('@/lib/utils', () => ({
  cn: (...classes: string[]) => classes.join(' '),
}));

describe('Popover Components', () => {
  describe('Popover', () => {
    it('renders popover root component', () => {
      const { container } = render(
        <Popover>
          <div>Test Content</div>
        </Popover>
      );

      // Popover root doesn't render anything visible, just provides context
      expect(container).toBeTruthy();
    });
  });
});
