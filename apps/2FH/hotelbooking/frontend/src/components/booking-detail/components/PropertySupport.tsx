import React from 'react';

interface PropertySupportProps {
  hotelName: string;
  bookingId: string;
  hotelNumber: string;
}

export const PropertySupport = ({ hotelName, bookingId, hotelNumber }: PropertySupportProps) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Property Support</h3>
      <div className="space-y-3 text-sm text-gray-600">
        <p>For special request or questions about your reservation, contact {hotelName}</p>
        <div className="text-sm text-gray-500">Itinerary: {bookingId}</div>
        <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors">Call {hotelNumber}</button>
      </div>
    </div>
  );
};
