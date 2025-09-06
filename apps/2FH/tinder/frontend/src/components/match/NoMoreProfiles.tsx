import React from 'react';

interface NoMoreProfilesProps {
  setCurrentIndex: (_index: number) => void;
  onClose: () => void;
}

export const NoMoreProfiles: React.FC<NoMoreProfilesProps> = ({ setCurrentIndex, onClose }) => (
  <div className="w-full h-full bg-gradient-to-br from-pink-50 to-red-50 flex items-center justify-center">
    <div className="text-center">
      <div className="text-6xl mb-4">💔</div>
      <h2 className="text-2xl font-bold text-gray-700 mb-2">No more profiles</h2>
      <p className="text-gray-500 mb-6">Check back later for new matches!</p>
      <div className="space-x-4">
        <button
          onClick={() => setCurrentIndex(0)}
          className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
        >
          Start Over
        </button>
        <button
          onClick={onClose}
          className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);
