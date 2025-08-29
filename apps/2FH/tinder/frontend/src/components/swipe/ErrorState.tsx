import React from 'react';

interface ErrorStateProps {
  refetch: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ refetch }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center w-full">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Алдаа гарлаа!</h2>
      <p className="text-gray-600 mb-4">
        {'Unknown error occurred'}
      </p>
      <div className="text-sm text-gray-500 mb-4">
        <p>Error details:</p>
        <p>Profiles error: {'Error occurred'}</p>
        <p>User profile error: {'No error'}</p>
        <p>Network status: {'Unknown'}</p>
      </div>
      <button
        onClick={() => {
          refetch();
          window.location.reload();
        }}
        className="bg-red-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-600 transition-colors"
      >
        Дахин оролдох
      </button>
    </div>
  </div>
);
