import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeaderSwipe } from './HeaderSwipe';
import { ActionButtons } from './ActionButtons';
import { MatchModal } from './MatchModal';
import { useTinderSwipe } from './useTinderSwipe';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';
import { NoMoreProfiles } from './NoMoreProfiles';
import { ProfileCards } from './ProfileCards';

const TinderSwipeContent: React.FC<{ currentUserId: string }> = ({ currentUserId }) => {
  const [isDragging, setIsDragging] = useState(false);
  
  const {
    matchedProfile,
    animatingCards,
    visibleProfiles,
    handleDislike,
    handleLike,
    handleSuperLike,
    handleKeepSwiping,
    handleMessage,
    testSwipe,
    currentIndex,
    totalProfiles,
    isTransitioning,
  } = useTinderSwipe(currentUserId);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      handleDislike();
    } else {
      handleLike();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-15 w-full">
      <div className="w-full">
        <HeaderSwipe />
        
        {/* Enhanced debug info with smooth animations */}
        <motion.div 
          className="text-center mb-4 text-sm text-gray-600"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <motion.span
            key={`profile-${currentIndex}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="font-medium"
          >
            Profile {currentIndex + 1} of {totalProfiles}
          </motion.span>
          {' | '}
          <span>Visible: {visibleProfiles.length}</span>
          {' | '}
          <motion.button 
            onClick={testSwipe}
            className="text-blue-500 underline hover:text-blue-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isTransitioning}
          >
            Test Swipe Logic
          </motion.button>
          {isTransitioning && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="ml-2 text-orange-500"
            >
              Transitioning...
            </motion.span>
          )}
        </motion.div>
        
        {/* Enhanced ProfileCards with better animation handling */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <ProfileCards
            visibleProfiles={visibleProfiles}
            _isDragging={isDragging}
            _setIsDragging={setIsDragging}
            animatingCards={animatingCards}
            onSwipe={handleSwipe}
          />
        </motion.div>
        
        <ActionButtons
          onDislike={handleDislike}
          onLike={handleLike}
          onSuperLike={handleSuperLike}
        />
      </div>
      <AnimatePresence>
        {matchedProfile && (
          <MatchModal
            profile={matchedProfile}
            onKeepSwiping={handleKeepSwiping}
            onMessage={handleMessage}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const TinderSwipeMain: React.FC<{ currentUserId: string }> = ({ currentUserId }) => {
  const {
    setCurrentIndex,
    totalProfiles,
    hasMoreProfiles,
  } = useTinderSwipe(currentUserId);

  // Check if we have profiles and if there are more to show
  if (totalProfiles > 0 && hasMoreProfiles) {
    return <TinderSwipeContent currentUserId={currentUserId} />;
  }

  return <NoMoreProfiles setCurrentIndex={setCurrentIndex} />;
};

const TinderSwipeConditional: React.FC<{ currentUserId: string }> = ({ currentUserId }) => {
  const {
    loading,
    error,
  } = useTinderSwipe(currentUserId);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState refetch={() => {
      // Refetch functionality placeholder
      console.log('Refetch requested');
    }} />;
  }

  return <TinderSwipeMain currentUserId={currentUserId} />;
};

const TinderSwipeDeck: React.FC<{ currentUserId: string }> = ({ currentUserId }) => {
  return <TinderSwipeConditional currentUserId={currentUserId} />;
};

export default TinderSwipeDeck;