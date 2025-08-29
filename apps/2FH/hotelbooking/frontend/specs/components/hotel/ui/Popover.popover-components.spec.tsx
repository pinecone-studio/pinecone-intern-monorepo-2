import { render, screen } from '@/TestUtils';
import { Popover, PopoverTrigger, PopoverContent } from '../../../../src/components/ui/Popover';

jest.mock('@/lib/utils', () => ({
  cn: (...classes: string[]) => classes.join(' '),
}));

describe('Popover Components', () => {
  it('renders Popover with children', () => {
    render(
      <Popover>
        <div>Popover content</div>
      </Popover>
    );

    expect(screen.getByText('Popover content')).toBeInTheDocument();
  });

  it('renders PopoverTrigger with children', () => {
    render(
      <Popover>
        <PopoverTrigger>
          <button>Trigger</button>
        </PopoverTrigger>
      </Popover>
    );

    expect(screen.getByText('Trigger')).toBeInTheDocument();
  });

  it('renders PopoverContent with children', () => {
    render(
      <Popover defaultOpen>
        <PopoverContent>
          <div>Content</div>
        </PopoverContent>
      </Popover>
    );

    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
