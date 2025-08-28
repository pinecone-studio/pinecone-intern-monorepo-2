import React, { useState } from 'react';
import { HeaderSwipe } from './HeaderSwipe';
import { ActionButtons } from './ActionButtons';
import { MatchModal } from './MatchModal';
import { ProfileCard } from './ProfileCard';
import { AnimatePresence } from 'framer-motion';
import { useTinderSwipe } from './useTinderSwipe';
import { Profile } from './MockData';

const LoadingState: React.FC = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center w-full">
    <div className="text-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
      <p className="mt-4 text-gray-600">Profiles ачаалж байна...</p>
    </div>
  </div>
);

const ErrorState: React.FC<{ refetch: () => void }> = ({ refetch }) => (
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

const NoMoreProfiles: React.FC<{ setCurrentIndex: (index: number) => void }> = ({ setCurrentIndex }) => (
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

const ProfileCards: React.FC<{
  visibleProfiles: Profile[];
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
  animatingCards: Set<string>;
}> = ({ visibleProfiles, isDragging, setIsDragging, animatingCards }) => (
  <div className="relative mb-12" style={{ height: '600px' }}>
    <AnimatePresence mode="popLayout">
      {visibleProfiles.map((profile, index) => (
        <ProfileCard
          key={`${profile.id}-${index}`}
          profile={profile}
          index={index}
          onSwipe={() => {}} // This is now handled by the hook
          isDragging={isDragging}
          setIsDragging={setIsDragging}
          isExiting={animatingCards.has(profile.id)}
        />
      ))}
    </AnimatePresence>
  </div>
);

const TinderSwipeDeck: React.FC<{ currentUserId: string }> = ({ currentUserId }) => {
  const [isDragging, setIsDragging] = useState(false);
  
  const {
    profiles,
    currentIndex,
    matchedProfile,
    animatingCards,
    loading,
    userLoading,
    error,
    userError,
    visibleProfiles,
    refetch,
    handleDislike,
    handleLike,
    handleSuperLike,
    handleKeepSwiping,
    handleMessage,
    setCurrentIndex,
  } = useTinderSwipe(currentUserId);

  if (loading || userLoading) {
    return <LoadingState />;
  }

  if (error || userError) {
    return <ErrorState refetch={refetch} />;
  }

  if (currentIndex >= profiles.length) {
    return <NoMoreProfiles setCurrentIndex={setCurrentIndex} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-15 w-full">
      <div className="w-full">
        <HeaderSwipe />
        <ProfileCards
          visibleProfiles={visibleProfiles}
          isDragging={isDragging}
          setIsDragging={setIsDragging}
          animatingCards={animatingCards}
        />
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

export default TinderSwipeDeck;