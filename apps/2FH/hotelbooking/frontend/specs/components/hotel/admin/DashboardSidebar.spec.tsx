import { render, screen } from '@/TestUtils';
import DashboardSidebar from '../../../../src/components/admin/DashboardSidebar';

// Mock the child components
jest.mock('../../../../src/components/admin/SidebarTop', () => ({
  __esModule: true,
  default: () => <div data-testid="sidebar-top">Sidebar Top</div>,
}));

jest.mock('../../../../src/components/admin/SidebarBottom', () => ({
  __esModule: true,
  default: () => <div data-testid="sidebar-bottom">Sidebar Bottom</div>,
}));

describe('DashboardSidebar', () => {
  it('renders the sidebar container', () => {
    render(<DashboardSidebar />);

    expect(screen.getByTestId('sidebar-top')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-bottom')).toBeInTheDocument();
  });

  it('renders with correct structure', () => {
    render(<DashboardSidebar />);

    const sidebar = screen.getByTestId('sidebar-top').closest('div');
    expect(sidebar).toBeInTheDocument();
    expect(sidebar?.parentElement).toHaveClass('w-64', 'bg-white', 'shadow-lg');
  });

  it('renders SidebarTop component', () => {
    render(<DashboardSidebar />);

    expect(screen.getByTestId('sidebar-top')).toBeInTheDocument();
    expect(screen.getByText('Sidebar Top')).toBeInTheDocument();
  });

  it('renders SidebarBottom component', () => {
    render(<DashboardSidebar />);

    expect(screen.getByTestId('sidebar-bottom')).toBeInTheDocument();
    expect(screen.getByText('Sidebar Bottom')).toBeInTheDocument();
  });
});
