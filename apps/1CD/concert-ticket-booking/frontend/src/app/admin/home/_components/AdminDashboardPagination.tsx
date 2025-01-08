import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useQueryState } from 'nuqs';

export const AdminPagination = ({ totalPages }: { totalPages: number }) => {
  const [page, setPage] = useQueryState('page', { defaultValue: '1' });
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setPage(String(pageNumber));
    } else {
      setPage(page);
    }
  };
  const currentPage = Number(page);
  if (totalPages <= 1) {
    return <div data-testid="pagination-nothing-container"></div>;
  }
  return (
    <Pagination data-testid="pagination-container">
      <PaginationContent className="cursor-pointer text-black">
        <PaginationItem>
          <PaginationLink className="border rounded mx-3 text-black" data-testid="left-btn" onClick={() => handlePageChange(currentPage - 1)}>
            <ChevronLeft />
          </PaginationLink>
        </PaginationItem>
        {[...Array(totalPages)].map((_, index) => (
          <PaginationItem key={index}>
            <PaginationLink
              className={`border rounded text-black ${currentPage === index + 1 ? 'bg-slate-500 text-white' : ''}`}
              key={index}
              data-testid={`currentPage-${index}`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationLink className="border rounded mx-3" data-testid="right-btn" onClick={() => handlePageChange(currentPage + 1)}>
            <ChevronRight />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
