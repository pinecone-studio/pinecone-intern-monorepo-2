import { render, screen } from '@/TestUtils';
import SidebarTop from '../../../../src/components/admin/SidebarTop';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Circle: ({ className }: { className: string }) => (
    <div data-testid="circle-icon" className={className}>
      ●
    </div>
  ),
  Zap: ({ className }: { className: string }) => (
    <div data-testid="zap-icon" className={className}>
      ⚡
    </div>
  ),
}));

describe('SidebarTop', () => {
  it('renders the sidebar top section', () => {
    render(<SidebarTop />);

    expect(screen.getByText('Pedia')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('renders with correct structure', () => {
    render(<SidebarTop />);

    const sidebarTop = screen.getByText('Pedia').parentElement?.parentElement;
    expect(sidebarTop).toHaveClass('p-4', 'text-xl', 'font-bold', 'flex', 'items-center', 'gap-2');
  });

  it('renders the title with correct styling', () => {
    render(<SidebarTop />);

    const title = screen.getByText('Pedia');
    expect(title).toHaveClass('text-[#334155]', 'font-medium', 'text-sm');
  });

  it('renders the subtitle', () => {
    render(<SidebarTop />);

    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('renders subtitle with correct styling', () => {
    render(<SidebarTop />);

    const subtitle = screen.getByText('Admin');
    expect(subtitle).toHaveClass('text-[#334155]', 'font-medium', 'text-sm');
  });

  it('renders navigation links', () => {
    render(<SidebarTop />);

    expect(screen.getByText('Hotels')).toBeInTheDocument();
    expect(screen.getByText('Guests')).toBeInTheDocument();
  });

  it('renders navigation links with correct styling', () => {
    render(<SidebarTop />);

    const hotelsLink = screen.getByText('Hotels');
    const guestsLink = screen.getByText('Guests');

    expect(hotelsLink).toHaveClass('px-4', 'py-2', 'flex', 'gap-2', 'items-center', 'text-[#09090b]', 'font-normal', 'text-sm');
    expect(guestsLink).toHaveClass('px-4', 'py-2', 'flex', 'gap-2', 'items-center', 'text-[#09090b]', 'font-normal', 'text-sm');
  });

  it('renders icons in navigation', () => {
    render(<SidebarTop />);

    expect(screen.getAllByTestId('zap-icon')).toHaveLength(2);
  });
});
