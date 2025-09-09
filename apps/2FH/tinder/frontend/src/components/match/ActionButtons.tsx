import React from 'react';
import { motion } from 'framer-motion';

export const ActionButtons: React.FC<{
  onDislike: () => void;
  onLike: () => void;
  onSuperLike: () => void;
  onRewind?: () => void;
  onBoost?: () => void;
}> = ({ onDislike, onLike, onSuperLike, onRewind, onBoost }) => {
  return (
    <div className="flex items-center justify-center gap-8 w-full">
      {/* Dislike button */}
      <motion.button
        onClick={onDislike}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="flex flex-col items-center gap-2"
      >
        <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow">
          <svg className="w-7 h-7 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

      </motion.button>

      {/* Super Like button */}
      <motion.button
        onClick={onSuperLike}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="flex flex-col items-center gap-2"
      >
        <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow">
          <svg className="w-7 h-7 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
      </motion.button>

      {/* Like button */}
      <motion.button
        onClick={onLike}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="flex flex-col items-center gap-2"
      >
        <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow">
          <svg className="w-7 h-7 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </div>
      </motion.button>
    </div>
  );
};