import React from 'react';
import { Button } from '@/components/ui/button';
import { Props } from '../global';

export const ButtonNextPrevious = ({ nextPage, previousPage }: Props) => {
  if (nextPage) {
    const handleNextpage = nextPage;
    return (
      <Button
        onClick={handleNextpage}
        className="ml-auto rounded-full bg-[#E11D48E5] text-white text-[14px] font-medium px-8 py-4 shadow-sm hover:opacity-95 active:opacity-90 focus:outline-none focus:ring-4 focus:ring-pink-200"
      >
        Next
      </Button>
    );
  } else {
    const handlePreviousPage = previousPage;
    return (
      <Button
        onClick={handlePreviousPage}
        className="rounded-full bg-white text-black border border-black text-[14px] font-medium px-8 py-4 shadow-sm hover:text-white hover:bg-black hover:opacity-95 active:opacity-90 focus:outline-none focus:ring-4 focus:ring-pink-200"
      >
        Back
      </Button>
    );
  }
};
