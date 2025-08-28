import React from 'react';
import { motion } from 'framer-motion';

const getOverlayStyles = (direction: 'left' | 'right') => {
  const isLeft = direction === 'left';
  return {
    bgColor: isLeft ? 'bg-red-500/20' : 'bg-green-500/20',
    borderColor: isLeft ? 'border-red-500 text-red-500' : 'border-green-500 text-green-500',
    position: isLeft ? 'left-8' : 'right-8',
    rotation: isLeft ? '-rotate-12' : 'rotate-12',
    text: isLeft ? 'NOPE' : 'LIKE'
  };
};

const OverlayBadge: React.FC<{ direction: 'left' | 'right' }> = ({ direction }) => {
  const styles = getOverlayStyles(direction);
  
  return (
    <div className={`absolute top-12 ${styles.position} bg-transparent border-4 ${styles.borderColor} px-6 py-3 rounded-lg font-black text-2xl transform ${styles.rotation}`}>
      {styles.text}
    </div>
  );
};

export const SwipeOverlay: React.FC<{
  direction: 'left' | 'right';
  opacity: number;
}> = ({ direction, opacity }) => {
  const styles = getOverlayStyles(direction);

  return (
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity }}
      exit={{ opacity: 0 }}
    >
      <div className={`absolute inset-0 ${styles.bgColor}`}>
        <OverlayBadge direction={direction} />
      </div>
    </motion.div>
  );
};