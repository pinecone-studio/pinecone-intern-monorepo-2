import { useState, useEffect, useCallback } from 'react';

interface UseStoryProgressProps {
  storiesLength: number;
  currentIndex: number;
  onNext: () => void;
}

export const useStoryProgress = ({ storiesLength, currentIndex, onNext }: UseStoryProgressProps) => {
  const [progress, setProgress] = useState(0);

  const handleNext = useCallback(() => {
    onNext();
  }, [onNext]);

  useEffect(() => {
    if (!storiesLength) return;

    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Use a microtask to defer the onNext call
          Promise.resolve().then(() => {
            handleNext();
          });
          return 100;
        }
        return prev + 1;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [currentIndex, storiesLength, handleNext]);

  return progress;
};
