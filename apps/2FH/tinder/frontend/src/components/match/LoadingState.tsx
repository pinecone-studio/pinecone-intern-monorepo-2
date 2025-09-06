import React from 'react';

export const LoadingState: React.FC = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center w-full">
    <div className="text-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
      <p className="mt-4 text-gray-600">Profiles ачаалж байна...</p>
    </div>
  </div>
);
