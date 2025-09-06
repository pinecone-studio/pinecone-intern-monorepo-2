import { useState, useCallback, useRef, useEffect } from 'react';
import { Profile } from '../generated';

interface UseProfileNavigationReturn {
  currentIndex: number;
  totalProfiles: number;
  hasMoreProfiles: boolean;
  currentProfile: Profile | undefined;
  nextProfile: Profile | undefined;
  moveToNext: () => void;
  goBack: () => void;
  resetToBeginning: () => void;
  setCurrentIndex: (index: number) => void;
  canGoBack: boolean;
}

export const useProfileNavigation = (profiles: Profile[]): UseProfileNavigationReturn => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalProfiles = profiles.length;

  // Use ref to prevent unnecessary re-renders
  const lastValidIndex = useRef(0);

  // Reset index when profiles change
  useEffect(() => {
    if (profiles.length > 0 && currentIndex >= profiles.length) {
      setCurrentIndex(0);
    }
    lastValidIndex.current = Math.min(currentIndex, profiles.length - 1);
  }, [profiles.length, currentIndex]);

  // Memoized computed values
  const hasMoreProfiles = currentIndex < totalProfiles - 1;
  const canGoBack = currentIndex > 0;
  const currentProfile = profiles[currentIndex];
  const nextProfile = profiles[currentIndex + 1];

  const moveToNext = useCallback(() => {
    setCurrentIndex(prevIndex => {
      const nextIndex = prevIndex + 1;
      return nextIndex >= totalProfiles ? 0 : nextIndex;
    });
  }, [totalProfiles]);

  const goBack = useCallback(() => {
    setCurrentIndex(prevIndex => Math.max(0, prevIndex - 1));
  }, []);

  const resetToBeginning = useCallback(() => {
    setCurrentIndex(0);
  }, []);

  const setCurrentIndexDirect = useCallback((index: number) => {
    const validIndex = Math.max(0, Math.min(index, totalProfiles - 1));
    setCurrentIndex(validIndex);
  }, [totalProfiles]);

  return {
    currentIndex,
    totalProfiles,
    hasMoreProfiles,
    currentProfile,
    nextProfile,
    moveToNext,
    goBack,
    resetToBeginning,
    setCurrentIndex: setCurrentIndexDirect,
    canGoBack,
  };
};