'use client';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  searchQuery: string;
  onSearchChange: (_e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}

export const SearchInput = ({ 
  searchQuery, 
  onSearchChange, 
  onClear 
}: SearchInputProps) => (
  <div className="relative">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
    <input
      type="text"
      placeholder="Search"
      value={searchQuery}
      onChange={onSearchChange}
      className="w-full pl-10 pr-10 py-2 bg-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
    />
    {searchQuery && (
      <button 
        aria-label="Clear search" 
        type="button" 
        className="absolute right-3 top-1/2 transform -translate-y-1/2" 
        onClick={onClear}
      >
        <X className="text-gray-400 w-4 h-4 cursor-pointer" />
      </button>
    )}
  </div>
);