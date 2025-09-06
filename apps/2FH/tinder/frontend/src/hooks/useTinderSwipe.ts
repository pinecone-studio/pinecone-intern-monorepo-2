import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useGetAllProfilesQuery, useGetProfileQuery, useSwipeMutation, SwipeAction, Profile } from '../generated';

// Types
type SwipeDirection = 'left' | 'right';

interface SwipeState {
  profiles: Profile[];
  currentIndex: number;
  matchedProfile: Profile | null;
  matches: Profile[];
  isDragging: boolean;
  animatingCards: Set<string>;
  loading: boolean;
  error: Error | null;
}

interface SwipeActions {
  handleSwipe: (direction: SwipeDirection) => void;
  handleDislike: () => void;
  handleLike: () => void;
  handleSuperLike: () => void;
  handleKeepSwiping: () => void;
  handleMessage: () => void;
  refetch: () => void;
  refetchProfile: () => void;
}

export const useTinderSwipe = (currentUserId: string): SwipeState & SwipeActions => {
  // GraphQL queries
  const {
    data: profilesData,
    loading: profilesLoading,
    error: profilesError,
    refetch: refetchProfiles
  } = useGetAllProfilesQuery();

  const {
    data: userProfileData,
    loading: userLoading,
    error: userError,
    refetch: refetchProfile
  } = useGetProfileQuery({
    variables: { userId: currentUserId },
    skip: !currentUserId,
  });

  // State management - reduced state
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matchedProfile, setMatchedProfile] = useState<Profile | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [matches, setMatches] = useState<Profile[]>([]);

  // Refs for performance optimization
  const pendingSwipes = useRef<Set<string>>(new Set());
  const animationTimeouts = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const animatingCards = useRef<Set<string>>(new Set());

  // Swipe mutation with improved error handling
  const [swipeMutation] = useSwipeMutation({
    onCompleted: (data) => {
      console.log('Swipe mutation completed:', data);
      if (data?.swipe?.success && data.swipe.match) {
        console.log('Match detected:', data.swipe.match);
        const matchedUserId = data.swipe.match.matcheduserId?.userId;
        if (matchedUserId) {
          const matchedProfile = profiles.find(p => p.userId === matchedUserId);
          if (matchedProfile) {
            console.log('Setting matched profile:', matchedProfile);
            setMatchedProfile(matchedProfile);
            setMatches(prev => [...prev, matchedProfile]);
            refetchProfile();
          }
        }
      }
    },
    onError: (error) => {
      console.error('Swipe mutation error:', error);
    },
  });

  // Memoized profile filtering based on interestedIn preference
  const filteredProfiles = useMemo(() => {
    if (!profilesData?.getAllProfiles || !userProfileData?.getProfile?.interestedIn) {
      return [];
    }

    const userInterestedIn = userProfileData.getProfile.interestedIn.toLowerCase();
    const otherProfiles = profilesData.getAllProfiles.filter(profile => profile.userId !== currentUserId);

    switch (userInterestedIn) {
      case 'male':
        return otherProfiles.filter(profile => profile.gender?.toLowerCase() === 'male');
      case 'female':
        return otherProfiles.filter(profile => profile.gender?.toLowerCase() === 'female');
      case 'both':
        return otherProfiles.filter(profile =>
          profile.gender?.toLowerCase() === 'male' ||
          profile.gender?.toLowerCase() === 'female'
        );
      default:
        return otherProfiles;
    }
  }, [profilesData?.getAllProfiles, userProfileData?.getProfile?.interestedIn, currentUserId]);

  // Update profiles when data changes - only when actually different
  useEffect(() => {
    if (filteredProfiles.length > 0 && JSON.stringify(filteredProfiles) !== JSON.stringify(profiles)) {
      setProfiles(filteredProfiles);
      setCurrentIndex(0);
    }
  }, [filteredProfiles, profiles]);

  // Cleanup animation timeouts on unmount
  useEffect(() => {
    return () => {
      animationTimeouts.current.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  // Backend swipe function with better error handling
  const sendSwipeToBackend = useCallback(async (profileId: string, direction: SwipeDirection, isSuperLike: boolean = false) => {
    if (pendingSwipes.current.has(profileId)) {
      return;
    }

    pendingSwipes.current.add(profileId);

    try {
      let action: SwipeAction;
      if (direction === 'right') {
        action = isSuperLike ? SwipeAction.SuperLike : SwipeAction.Like;
      } else {
        action = SwipeAction.Dislike;
      }

      await swipeMutation({
        variables: {
          swiperId: currentUserId,
          targetId: profileId,
          action: action
        }
      });
    } catch (error) {
      console.error('Backend swipe error:', error);
    } finally {
      pendingSwipes.current.delete(profileId);
    }
  }, [currentUserId, swipeMutation]);

  // Card animation cleanup with timeout management
  const cleanupCardAnimation = useCallback((profileId: string) => {
    const timeout = setTimeout(() => {
      animatingCards.current.delete(profileId);
      animationTimeouts.current.delete(profileId);
    }, 300);

    // Clear existing timeout if any
    const existingTimeout = animationTimeouts.current.get(profileId);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    animationTimeouts.current.set(profileId, timeout);
  }, []);

  // Main swipe handler - optimized
  const handleSwipe = useCallback((direction: SwipeDirection, isSuperLike: boolean = false) => {
    const currentProfile = profiles[currentIndex];
    if (!currentProfile) return;

    // Add to animating cards without causing re-render
    animatingCards.current.add(currentProfile.id);

    // Update index and cleanup
    setCurrentIndex(prev => prev + 1);
    cleanupCardAnimation(currentProfile.id);
    sendSwipeToBackend(currentProfile.userId, direction, isSuperLike);
  }, [currentIndex, profiles, sendSwipeToBackend, cleanupCardAnimation]);

  // Action handlers - memoized
  const handleDislike = useCallback(() => handleSwipe('left'), [handleSwipe]);
  const handleLike = useCallback(() => handleSwipe('right', false), [handleSwipe]);
  const handleSuperLike = useCallback(() => handleSwipe('right', true), [handleSwipe]);
  const handleKeepSwiping = useCallback(() => setMatchedProfile(null), []);

  const handleMessage = useCallback(() => {
    setMatchedProfile(null);
    // TODO: Implement proper navigation to messages
    console.log('Opening messages...');
  }, []);

  // Computed values - memoized
  const loading = useMemo(() =>
    (profilesLoading || userLoading) && profiles.length === 0,
    [profilesLoading, userLoading, profiles.length]
  );

  const error = useMemo(() =>
    (profilesError || userError) && profiles.length === 0 ? (profilesError || userError || null) : null,
    [profilesError, userError, profiles.length]
  );

  // Debug logging in development - only when values actually change
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('useTinderSwipe Debug:', {
        loading,
        error: error?.message,
        profilesCount: profiles.length,
        currentIndex,
        hasMatchedProfile: !!matchedProfile,
        matchesCount: matches.length
      });
    }
  }, [loading, error?.message, profiles.length, currentIndex, matchedProfile, matches.length]);

  return {
    // State
    profiles,
    currentIndex,
    matchedProfile,
    matches,
    isDragging,
    animatingCards: animatingCards.current,
    loading,
    error,

    // Actions
    handleSwipe,
    handleDislike,
    handleLike,
    handleSuperLike,
    handleKeepSwiping,
    handleMessage,
    refetch: refetchProfiles,
    refetchProfile
  };
};