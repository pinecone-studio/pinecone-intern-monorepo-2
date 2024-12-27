import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AdminHeader } from '@/app/admin/home/_components/AdminHeader';

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
  });

  it('should render the "Exit Account" button with text "Гарах"', () => {
    render(<AdminHeader />);
    
    const exitButton = screen.getByRole('button', { name: /гарах/i });
    expect(exitButton).toBeInTheDocument();
  }); 

  it('should highlight the active link correctly', () => {
    render(<AdminHeader />);

    // Click on "Цуцлах хүсэлт"
    fireEvent.click(screen.getByText('Цуцлах хүсэлт'));

    expect(screen.getByText('Цуцлах хүсэлт')).toHaveClass('font-bold text-black');
    expect(screen.getByText('Тасалбар')).not.toHaveClass('font-bold text-black');
  });
});
