'use client';
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface GuestsFiltersProps {
  searchTerm: string;
  statusFilter: string;
  onSearchChange: (_value: string) => void;
  onStatusFilterChange: (_value: string) => void;
}

const GuestsFilters = ({ searchTerm, statusFilter, onSearchChange, onStatusFilterChange }: GuestsFiltersProps) => {
  return (
    <div className="flex gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input placeholder="Search" value={searchTerm} onChange={(e) => onSearchChange(e.target.value)} className="pl-10" />
      </div>
      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="BOOKED">Booked</SelectItem>
          <SelectItem value="COMPLETED">Completed</SelectItem>
          <SelectItem value="CANCELLED">Cancelled</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default GuestsFilters;
