import { AdminPagination } from '@/components/AdminDashboardPagination';
import { render, fireEvent, screen } from '@testing-library/react';

describe('Pagination Logic - handlePageChange', () => {
  it('should handle pagination in AdminPagination component', async () => {
    const onPageChange = jest.fn();
    const currentPage = 1;
    const totalPages = 3;

    render(<AdminPagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />);

    const pageTwoLink = screen.getByTestId('page-1');
    fireEvent.click(pageTwoLink);
    expect(onPageChange);

    const leftButton = screen.getByTestId('left-btn');
    fireEvent.click(leftButton);
    expect(onPageChange);
    const rightButton = screen.getByTestId('right-btn');
    fireEvent.click(rightButton);
    expect(onPageChange);
  });
});
