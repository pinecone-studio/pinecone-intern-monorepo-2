import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AdminHeader } from '@/app/admin/home/_components/AdminHeader';


jest.mock('lucide-react', () => ({
  User: () => <div data-testid="user-icon">User</div>,
}));

jest.mock('src/components/providers/AuthProvider', () => ({
  useAuth: jest.fn(),
}));

describe('AdminHeader Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render navigation links correctly', () => {
    render(<AdminHeader />);

    expect(screen.getByText('Тасалбар')).toBeInTheDocument();
    expect(screen.getByText('Цуцлах хүсэлт')).toBeInTheDocument();
    expect(screen.getByText('Артист')).toBeInTheDocument();
  });

  it('should display the user icon', () => {
    render(<AdminHeader />);

    expect(screen.getByTestId('user-icon')).toBeInTheDocument();
  });

});
