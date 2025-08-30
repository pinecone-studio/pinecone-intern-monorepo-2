import { useState, useCallback, useEffect } from 'react';
import { Profile } from './MockData';
import { toast } from 'react-toastify';
import { useProfileData } from './useProfileData';
import { useProfileFiltering } from './useProfileFiltering';

// Separate function to calculate visible profiles
const calculateVisibleProfiles = (profiles: Profile[], currentIndex: number) => {
  if (profiles.length === 0) return [];
  
  // Show current profile and next 2 profiles for smooth transitions
  const startIndex = Math.max(0, currentIndex);
  const endIndex = Math.min(startIndex + 3, profiles.length);
  
  const visible = profiles.slice(startIndex, endIndex);
  return visible;
};

export const useTinderSwipe = (currentUserId: string) => {
  const { loading, error, refetch } = useProfileData(currentUserId);
  const { profiles } = useProfileFiltering(currentUserId);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matchedProfile, setMatchedProfile] = useState<Profile | null>(null);
  const [animatingCards] = useState<Set<string>>(new Set());
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Reset currentIndex when profiles change
  useEffect(() => {
    if (profiles.length > 0 && currentIndex >= profiles.length) {
      setCurrentIndex(0);
    }
  }, [profiles, currentIndex]);

  const realSwipe = useCallback(async () => {
    try {
      const currentProfile = profiles[currentIndex];
      if (!currentProfile) {
        toast.error('Profile олдсонгүй');
        return;
      }

      // Simulate swipe success for now
      toast.success('Swipe амжилттай!');
      await refetch();
    } catch (error) {
      console.error('Swipe error:', error);
      toast.error('Swipe хийхэд алдаа гарлаа');
    }
  }, [currentIndex, profiles, refetch]);

  const handleSwipe = useCallback(
    async () => {
      const currentProfile = profiles[currentIndex];
      if (!currentProfile || isTransitioning) return;

      // Set transition state to prevent multiple swipes
      setIsTransitioning(true);

      // Add animation delay for smooth transition
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Perform the actual swipe
      await realSwipe();
      
      // Move to next profile with smooth transition
      setCurrentIndex(prevIndex => {
        const nextIndex = prevIndex + 1;
        // Ensure we don't go beyond available profiles
        const finalIndex = Math.min(nextIndex, profiles.length - 1);
        
        // If we've reached the end, reset to 0 to show profiles again
        if (finalIndex >= profiles.length - 1) {
          return 0;
        }
        
        return finalIndex;
      });

      // Reset transition state after animation completes
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    },
    [currentIndex, profiles, realSwipe, isTransitioning]
  );

  // Individual button handlers
  const onLike = useCallback(() => { if (!isTransitioning) handleSwipe(); }, [handleSwipe, isTransitioning]);
  const onDislike = useCallback(() => { if (!isTransitioning) handleSwipe(); }, [handleSwipe, isTransitioning]);
  const onSuperLike = useCallback(() => { if (!isTransitioning) handleSwipe(); }, [handleSwipe, isTransitioning]);

  const goBack = useCallback(() => {
    if (currentIndex > 0 && !isTransitioning) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex, isTransitioning]);

  const resetProfiles = useCallback(() => {
    setCurrentIndex(0);
    setIsTransitioning(false);
    refetch();
  }, [refetch]);

  const handleKeepSwiping = useCallback(() => {
    setMatchedProfile(null);
  }, []);

  const handleMessage = useCallback(() => {
    setMatchedProfile(null);
    alert('Opening messages...');
  }, []);

  // Create visibleProfiles array with smooth transitions
  const visibleProfiles = useCallback(() => {
    return calculateVisibleProfiles(profiles, currentIndex);
  }, [profiles, currentIndex]);

  // Test function to verify swipe logic
  const testSwipe = useCallback(() => {
    console.log('Testing swipe logic...');
    console.log('Current state:', {
      currentIndex, totalProfiles: profiles.length, visibleProfiles: visibleProfiles(),
      hasMoreProfiles: currentIndex < profiles.length - 1, isTransitioning
    });
  }, [currentIndex, profiles.length, visibleProfiles, isTransitioning]);

  return {
    // State
    currentIndex,
    currentProfile: profiles[currentIndex] || null,
    matchedProfile,
    animatingCards,
    loading,
    error,
    isTransitioning,
    
    // Actions
    handleLike: onLike,
    handleDislike: onDislike,
    handleSuperLike: onSuperLike,
    handleKeepSwiping,
    handleMessage,
    goBack,
    resetProfiles,
    setCurrentIndex,
    testSwipe, // For debugging
    
    // Data
    profiles,
    visibleProfiles: visibleProfiles(),
    totalProfiles: profiles.length,
    hasMoreProfiles: currentIndex < profiles.length - 1,
  };
}; 