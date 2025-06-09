import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '@/app/(admin)/_components/Header';
import '@testing-library/jest-dom';
import { usePathname } from 'next/navigation';

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('Header Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should highlight "Тасалбар" when pathname includes "ticket"', () => {
    (usePathname as jest.Mock).mockReturnValue('/ticket');

    render(<Header />);

    const ticketTab = screen.getByTestId('ticketPageBtn');
    const requestTab = screen.getByTestId('reqPageBtn');

    expect(ticketTab).toHaveTextContent('Тасалбар');
    expect(ticketTab).toHaveClass('border-black');
    expect(requestTab).toHaveClass('border-transparent');
  });

  it('should highlight "Цуцлах хүсэлт" when pathname includes "request"', () => {
    (usePathname as jest.Mock).mockReturnValue('/request');

    render(<Header />);

    const ticketTab = screen.getByTestId('ticketPageBtn');
    const requestTab = screen.getByTestId('reqPageBtn');

    expect(requestTab).toHaveTextContent('Цуцлах хүсэлт');
    expect(requestTab).toHaveClass('border-black');
    expect(ticketTab).toHaveClass('border-transparent');
  });

  it('should call router.push when "Тасалбар" is clicked', () => {
    (usePathname as jest.Mock).mockReturnValue('/request');

    render(<Header />);

    const ticketTab = screen.getByTestId('ticketPageBtn');
    fireEvent.click(ticketTab);

    expect(mockPush).toHaveBeenCalledWith('/ticket');
  });

  it('should call router.push when "Цуцлах хүсэлт" is clicked', () => {
    (usePathname as jest.Mock).mockReturnValue('/ticket');

    render(<Header />);

    const requestTab = screen.getByTestId('reqPageBtn');
    fireEvent.click(requestTab);

    expect(mockPush).toHaveBeenCalledWith('/request');
  });
});
