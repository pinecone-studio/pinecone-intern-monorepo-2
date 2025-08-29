'use client';
import { useState } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/Button';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchableSelectProps {
  value: string;
  onValueChange: (_value: string) => void;
  placeholder: string;
  options: { value: string; label: string }[];
  searchPlaceholder?: string;
}

export const SearchableSelect = ({ value, onValueChange, placeholder, options, searchPlaceholder = 'Search...' }: SearchableSelectProps) => {
  const [open, setOpen] = useState(false);

  const selectedOption = options.find((option) => option.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-[180px] justify-between">
          {selectedOption ? selectedOption.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[180px] p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>No option found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? '' : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check data-testid={`check-icon-${option.value}`} className={cn('mr-2 h-4 w-4', value === option.value ? 'opacity-100' : 'opacity-0')} />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

interface FilterControlsProps {
  searchTerm: string;
  setSearchTerm: (_value: string) => void;
  location: string;
  setLocation: (_value: string) => void;
  rooms: string;
  setRooms: (_value: string) => void;
  starRating: string;
  setStarRating: (_value: string) => void;
  userRating: string;
  setUserRating: (_value: string) => void;
  locationOptions: { value: string; label: string }[];
}

export const FilterControls = ({ searchTerm, setSearchTerm, location, setLocation, rooms, setRooms, starRating, setStarRating, userRating, setUserRating, locationOptions }: FilterControlsProps) => {
  const roomOptions = [
    { value: '', label: 'All Rooms' },
    { value: 'single', label: 'Single Room' },
    { value: 'double', label: 'Double Room' },
    { value: 'deluxe', label: 'Deluxe Room' },
    { value: 'suite', label: 'Suite' },
    { value: 'family', label: 'Family Room' },
    { value: 'presidential', label: 'Presidential Suite' },
  ];

  const starRatingOptions = [
    { value: '1', label: '1 Star' },
    { value: '2', label: '2 Stars' },
    { value: '3', label: '3 Stars' },
    { value: '4', label: '4 Stars' },
    { value: '5', label: '5 Stars' },
  ];

  const userRatingOptions = [
    { value: '9+', label: '9+ / 10' },
    { value: '8+', label: '8+ / 10' },
    { value: '7+', label: '7+ / 10' },
    { value: '6+', label: '6+ / 10' },
    { value: '5+', label: '5+ / 10' },
  ];

  return (
    <div data-testid="filter-controls-container" className="flex gap-2 mb-4 w-full">
      <div data-testid="search-container" className="relative flex-1">
        <Search data-testid="search-icon" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Search hotels by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div data-testid="filters-container" className="flex gap-2">
        <SearchableSelect value={location} onValueChange={setLocation} placeholder="All Locations" options={locationOptions} searchPlaceholder="Search locations..." />
        <SearchableSelect value={rooms} onValueChange={setRooms} placeholder="All Rooms" options={roomOptions} searchPlaceholder="Search room types..." />
        <SearchableSelect value={starRating} onValueChange={setStarRating} placeholder="Select Star Rating" options={starRatingOptions} searchPlaceholder="Search star ratings..." />
        <SearchableSelect value={userRating} onValueChange={setUserRating} placeholder="Select User Rating" options={userRatingOptions} searchPlaceholder="Search user ratings..." />
      </div>
    </div>
  );
};
