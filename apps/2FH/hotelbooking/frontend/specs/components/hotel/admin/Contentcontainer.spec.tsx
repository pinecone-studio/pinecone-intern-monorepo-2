import { render, screen, fireEvent } from '@/TestUtils';
import Contentcontainer from '../../../../src/components/admin/Contentcontainer';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('Contentcontainer', () => {
  it('renders the content container', () => {
    render(<Contentcontainer />);

    expect(screen.getByText('Hotels')).toBeInTheDocument();
    expect(screen.getByText('+ Add Hotel')).toBeInTheDocument();
  });

  it('renders with correct structure', () => {
    render(<Contentcontainer />);

    const container = screen.getByText('Hotels').closest('div');
    expect(container).toHaveClass('p-4', 'border-t', 'flex', 'items-center', 'justify-between', 'space-x-2');
  });

  it('renders title with correct styling', () => {
    render(<Contentcontainer />);

    const title = screen.getByText('Hotels');
    expect(title).toHaveClass('text-[#020617]', 'font-semibold', 'text-2xl');
  });

  it('renders add hotel button with correct styling', () => {
    render(<Contentcontainer />);

    const button = screen.getByText('+ Add Hotel');
    expect(button).toHaveClass('bg-[#2563EB]', 'text-white', 'font-medium', 'w-[155px]', 'text-sm', 'px-4', 'py-2', 'rounded', 'hover:bg-[#1d4ed8]', 'transition-colors');
  });

  it('calls router.push when add hotel button is clicked', () => {
    const mockPush = jest.fn();
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    jest.spyOn(require('next/navigation'), 'useRouter').mockReturnValue({
      push: mockPush,
    });

    render(<Contentcontainer />);

    const button = screen.getByText('+ Add Hotel');
    fireEvent.click(button);

    expect(mockPush).toHaveBeenCalledWith('/admin/add-hotel');
  });

  it('renders button with correct width', () => {
    render(<Contentcontainer />);

    const button = screen.getByText('+ Add Hotel');
    expect(button).toHaveClass('w-[155px]');
  });

  it('renders with correct layout', () => {
    render(<Contentcontainer />);

    const container = screen.getByText('Hotels').closest('div');
    expect(container).toHaveClass('flex', 'items-center', 'justify-between');
  });

  it('renders with correct spacing', () => {
    render(<Contentcontainer />);

    const container = screen.getByText('Hotels').closest('div');
    expect(container).toHaveClass('space-x-2');
  });

  it('renders with correct padding', () => {
    render(<Contentcontainer />);

    const container = screen.getByText('Hotels').closest('div');
    expect(container).toHaveClass('p-4');
  });

  it('renders with correct border', () => {
    render(<Contentcontainer />);

    const container = screen.getByText('Hotels').closest('div');
    expect(container).toHaveClass('border-t');
  });

  it('renders button as clickable element', () => {
    render(<Contentcontainer />);

    const button = screen.getByText('+ Add Hotel');
    expect(button.tagName).toBe('BUTTON');
  });

  it('renders title as heading element', () => {
    render(<Contentcontainer />);

    const title = screen.getByText('Hotels');
    expect(title.tagName).toBe('H3');
  });
});
