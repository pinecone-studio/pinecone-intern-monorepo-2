'use client';
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

type SortField = 'id' | 'name' | 'hotel' | 'rooms' | 'guests' | 'date' | 'status';
type SortDirection = 'asc' | 'desc';

interface BookingWithDetails {
  id: string;
  originalId: string;
  name: string;
  hotel: string;
  rooms: string;
  guests: string;
  date: string;
  status: 'BOOKED' | 'COMPLETED' | 'CANCELLED';
}

interface GuestsTableProps {
  bookings: BookingWithDetails[];
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (_field: SortField) => void;
  onRowClick: (_bookingId: string) => void;
}

const GuestsTable = ({ bookings, sortField, sortDirection, onSort, onRowClick }: GuestsTableProps) => {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'BOOKED':
        return 'default';
      case 'COMPLETED':
        return 'secondary';
      case 'CANCELLED':
        return 'outline';
      default:
        return 'default';
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'BOOKED':
        return 'bg-blue-600 text-white';
      case 'COMPLETED':
        return 'bg-green-600 text-white';
      case 'CANCELLED':
        return 'bg-orange-500 text-white';
      default:
        return '';
    }
  };

  const renderSortableHeader = (field: SortField, label: string) => (
    <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => onSort(field)}>
      <div className="flex items-center gap-2">
        {label}
        <div className="flex flex-col">
          <ChevronUp className={cn('h-3 w-3', sortField === field && sortDirection === 'asc' ? 'text-gray-900' : 'text-gray-400')} />
          <ChevronDown className={cn('h-3 w-3 -mt-1', sortField === field && sortDirection === 'desc' ? 'text-gray-900' : 'text-gray-400')} />
        </div>
      </div>
    </TableHead>
  );

  return (
    <div className="bg-white rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            {renderSortableHeader('id', 'ID')}
            <TableHead>Name</TableHead>
            <TableHead>Hotel</TableHead>
            {renderSortableHeader('rooms', 'Rooms')}
            {renderSortableHeader('guests', 'Guests')}
            <TableHead>Date</TableHead>
            {renderSortableHeader('status', 'Status')}
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking, index) => (
            <TableRow
              key={booking.originalId}
              className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} cursor-pointer hover:bg-blue-50 transition-colors`}
              onClick={() => onRowClick(booking.originalId)}
            >
              <TableCell className="font-medium">{booking.id}</TableCell>
              <TableCell>{booking.name}</TableCell>
              <TableCell>{booking.hotel}</TableCell>
              <TableCell>{booking.rooms}</TableCell>
              <TableCell>{booking.guests}</TableCell>
              <TableCell>{booking.date}</TableCell>
              <TableCell>
                <Badge className={getStatusBadgeStyle(booking.status)} variant={getStatusBadgeVariant(booking.status)}>
                  {booking.status.charAt(0) + booking.status.slice(1).toLowerCase()}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default GuestsTable;
