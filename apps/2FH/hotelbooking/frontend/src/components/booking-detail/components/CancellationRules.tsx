import React from 'react';

export const CancellationRules = () => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Cancellation rules</h3>
      <div className="space-y-3 text-sm text-gray-600">
        <p>Free cancellation until Jun 30 at 4:00 pm (Pacific Standard Time (US & Canada); Tijuana).</p>
        <p>If you cancel or change your plans, please cancel your reservation in accordance with the property&apos;s cancellation policies to avoid a no-show charge.</p>
        <p>There is no charge for cancellations made before 4:00 pm (property local time) on Jun 30, 2024.</p>
        <p>Cancellations or changes made after 4:00 pm (property local time) on Jun 30, 2024, or no-shows are subject to a property fee equal to 100% of the total amount paid for the reservation.</p>
      </div>
    </div>
  );
};
