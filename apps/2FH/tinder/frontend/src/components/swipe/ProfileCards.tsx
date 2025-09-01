import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { Profile } from './MockData';
import { ProfileCard } from './ProfileCard';

interface ProfileCardsProps {
  visibleProfiles: Profile[];
  _isDragging: boolean;
  _setIsDragging: (_dragging: boolean) => void;
  animatingCards: Set<string>;
  onSwipe?: (_direction: 'left' | 'right') => void;
}

export const ProfileCards: React.FC<ProfileCardsProps> = ({ 
  visibleProfiles, 
  _isDragging, 
  _setIsDragging, 
  animatingCards,
  onSwipe
}) => {
  // Ensure visibleProfiles is always an array
  const safeVisibleProfiles = Array.isArray(visibleProfiles) ? visibleProfiles : [];
  
  // Create a swipe handler that calls the parent's swipe function
  const handleSwipe = (_direction: 'left' | 'right') => {
    if (onSwipe) {
      onSwipe(_direction);
    }
  };
  
  return (
    <div className="relative mb-12" style={{ height: '600px' }}>
      <AnimatePresence 
        mode="wait"
        initial={false}
        onExitComplete={() => {
          // Clean up any exit animations
          console.log('Card exit animation completed');
        }}
      >
        {safeVisibleProfiles.map((profile, index) => (
          <ProfileCard
            key={`${profile.id}-${profile.userId}-${index}`}
            profile={profile}
            index={index}
            _onSwipe={handleSwipe}
            _isDragging={_isDragging}
            setIsDragging={_setIsDragging}
            isExiting={animatingCards.has(profile.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
