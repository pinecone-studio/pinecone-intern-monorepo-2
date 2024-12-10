'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export const ComboboxDemo = () => {
  const [open, setOpen] = React.useState(false);
  const [adultQuantity, setAdultQuantity] = React.useState(1);

  const descBtn = () => {
    if (adultQuantity > 1) {
      setAdultQuantity(adultQuantity - 1);
    }
  };

  const closeModal = () => {
    setOpen(false);
  };

  return (
    <div data-cy="Adult-Select-Modal">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button data-testid="traveler-select-btn" variant="outline" role="combobox" className="w-[500px] justify-between" onClick={() => setOpen(!open)} data-cy="Adult-Select-Modal-Button">
            {adultQuantity} traveler{adultQuantity > 1 ? 's' : ''}, 1 room
            <ChevronDown className="opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[500px] p-0 min-h-44 relative">
          <h3 className="mt-5 ml-6 text-xl font-bold">Travels</h3>
          <div className="flex items-center justify-between pr-6 border-b-[1px] mx-4 pb-3">
            <p className="mt-5 ml-6">Adult</p>
            <div className="flex items-center gap-4">
              <button className="flex items-center justify-center w-10 h-10 border rounded-xl" onClick={descBtn} data-cy="Adult-Quantity-Desc-Button">
                -
              </button>
              <p data-cy="Adult-Quantity" className="text-xl">
                {adultQuantity}
              </p>
              <button data-cy="Adult-Quantity-Increase-Button" className="flex items-center justify-center w-10 h-10 border rounded-xl" onClick={() => setAdultQuantity(adultQuantity + 1)}>
                +
              </button>
            </div>
          </div>
          <button data-cy="Modal-Done-Button" className="absolute my-5 bg-blue-700 w-28 right-5" onClick={closeModal}>
            Done
          </button>
        </PopoverContent>
      </Popover>
    </div>
  );
};
