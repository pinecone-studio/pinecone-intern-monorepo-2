import React from 'react';

interface NoMoreProfilesProps {
  setCurrentIndex: (_index: number) => void;
}

export const NoMoreProfiles: React.FC<NoMoreProfilesProps> = ({ setCurrentIndex }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center w-full">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">No more profiles!</h2>
      <button 
        onClick={() => setCurrentIndex(0)} 
        className="bg-red-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-600 transition-colors"
      >
        Start Over
      </button>
    </div>
  </div>
);
