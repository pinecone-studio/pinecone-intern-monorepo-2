import { render, screen } from '@/TestUtils';
import SidebarBottom from '../../../../src/components/admin/SidebarBottom';

describe('SidebarBottom', () => {
  it('renders the sidebar bottom section', () => {
    render(<SidebarBottom />);

    expect(screen.getByText('admin')).toBeInTheDocument();
    expect(screen.getByText('admin@pedia.com')).toBeInTheDocument();
  });

  it('renders with correct structure', () => {
    render(<SidebarBottom />);

    const sidebarBottom = screen.getByText('admin').closest('div');
    expect(sidebarBottom?.parentElement?.parentElement).toHaveClass('p-2', 'border-t', 'flex', 'items-center', 'space-x-2');
  });

  it('renders admin avatar image', () => {
    render(<SidebarBottom />);

    const avatar = screen.getByAltText('Admin avatar');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', 'https://picsum.photos/30/30');
    expect(avatar).toHaveClass('rounded-full');
  });

  it('renders admin name with correct styling', () => {
    render(<SidebarBottom />);

    const adminName = screen.getByText('admin');
    expect(adminName).toHaveClass('text-sm', 'font-semibold', 'text-[#334155]');
  });

  it('renders admin email with correct styling', () => {
    render(<SidebarBottom />);

    const adminEmail = screen.getByText('admin@pedia.com');
    expect(adminEmail).toHaveClass('text-xs', 'font-normal', 'text-[#334155]');
  });

  it('renders user info container', () => {
    render(<SidebarBottom />);

    const userInfo = screen.getByText('admin').closest('div');
    expect(userInfo).toBeInTheDocument();
  });

  it('renders with correct layout structure', () => {
    render(<SidebarBottom />);

    const container = screen.getByText('admin').closest('.p-2');
    expect(container).toHaveClass('flex', 'items-center', 'space-x-2');
  });

  it('renders with correct border styling', () => {
    render(<SidebarBottom />);

    const container = screen.getByText('admin').closest('.p-2');
    expect(container).toHaveClass('border-t');
  });

  it('renders with correct padding', () => {
    render(<SidebarBottom />);

    const container = screen.getByText('admin').closest('.p-2');
    expect(container).toHaveClass('p-2');
  });
});
