import { render, screen } from '@/TestUtils';
import Header from '../../../../src/components/admin/Header';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  PanelLeft: ({ className }: { className: string }) => (
    <div data-testid="panel-left-icon" className={className}>
      📋
    </div>
  ),
}));

describe('Header', () => {
  it('renders the header component', () => {
    render(<Header />);

    expect(screen.getByTestId('panel-left-icon')).toBeInTheDocument();
    expect(screen.getByText('Hotels')).toBeInTheDocument();
  });

  it('renders with correct structure', () => {
    render(<Header />);

    const header = screen.getByText('Hotels').closest('div');
    expect(header).toHaveClass('p-4', 'border-t', 'flex', 'items-center', 'space-x-2', 'text-[#020617]', 'text-sm', 'font-normal');
  });

  it('renders panel left icon', () => {
    render(<Header />);

    expect(screen.getByTestId('panel-left-icon')).toBeInTheDocument();
  });

  it('renders hotels text', () => {
    render(<Header />);

    expect(screen.getByText('Hotels')).toBeInTheDocument();
  });

  it('renders icon with correct styling', () => {
    render(<Header />);

    const panelLeftIcon = screen.getByTestId('panel-left-icon');
    expect(panelLeftIcon).toHaveClass('w-3', 'h-3', 'text-[#334155]');
  });
});
