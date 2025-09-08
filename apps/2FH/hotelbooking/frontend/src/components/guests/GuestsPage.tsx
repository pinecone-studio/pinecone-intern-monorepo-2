/* eslint-disable  */
'use client';
import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useGuestsData } from './useGuestsData';
import GuestsFilters from './GuestsFilters';
import GuestsTable from './GuestsTable';

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

type SortField = 'id' | 'name' | 'hotel' | 'rooms' | 'guests' | 'date' | 'status';
type SortDirection = 'asc' | 'desc';

const StateFallback = ({ type, message }: { type: 'loading' | 'error' | 'empty'; message: string }) => (
  <div className="p-6">
    <div className="text-lg font-semibold mb-4">Guests</div>
    <div className="flex items-center justify-center h-64">
      <div className={type === 'error' ? 'text-red-500' : 'text-gray-500'}>{message}</div>
    </div>
  </div>
);

const GuestsPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const { bookings, loading, error } = useGuestsData();

  const sortBookings = (bookings: BookingWithDetails[], sortField: SortField, sortDirection: SortDirection) => {
    return [...bookings].sort((a, b) => {
      let aValue: string | number = a[sortField];
      let bValue: string | number = b[sortField];

      if (sortField === 'id') {
        aValue = parseInt(a.id);
        bValue = parseInt(b.id);
      } else if (sortField === 'guests') {
        aValue = parseInt(a.guests.match(/\d+/)?.[0] || '0');
        bValue = parseInt(b.guests.match(/\d+/)?.[0] || '0');
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });
  };

  const filteredAndSortedBookings = useMemo(() => {
    const filtered = bookings.filter((booking) => {
      const matchesSearch = booking.name.toLowerCase().includes(searchTerm.toLowerCase()) || booking.hotel.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    return sortBookings(filtered, sortField, sortDirection);
  }, [bookings, searchTerm, statusFilter, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleRowClick = (bookingId: string) => {
    router.push(`/admin/guests/${bookingId}`);
  };

  if (loading) return <StateFallback type="loading" message="Loading guests..." />;
  if (error) return <StateFallback type="error" message={`Error loading guests: ${error.message}`} />;
  if (!loading && !error && filteredAndSortedBookings.length === 0) return <StateFallback type="empty" message="No guests found matching your criteria." />;

  return (
    <div className="p-6">
      <div className="text-2xl font-bold text-gray-800 mb-6">Guests</div>
      <GuestsFilters searchTerm={searchTerm} statusFilter={statusFilter} onSearchChange={setSearchTerm} onStatusFilterChange={setStatusFilter} />
      <GuestsTable bookings={filteredAndSortedBookings} sortField={sortField} sortDirection={sortDirection} onSort={handleSort} onRowClick={handleRowClick} />
    </div>
  );
};

export default GuestsPage;
