import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination';
import { ChevronLeft, ChevronRight } from 'lucide-react';


interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (_page: number) => void;
}

export const AdminPagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    } else {
      onPageChange(currentPage);
    }
  };
  return (
    <Pagination>
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
              data-testid={`page-${index}`}
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
