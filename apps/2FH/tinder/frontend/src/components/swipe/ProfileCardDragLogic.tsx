import { useState, useCallback } from 'react';
import type { PanInfo, Transition } from 'framer-motion';

interface DragState {
  x: number;
  y: number;
}

interface ProfileCardDragLogicProps {
  index: number;
  onSwipe: (_direction: 'left' | 'right') => void;
  setIsDragging: (_dragging: boolean) => void;
}

// Consolidated transform calculation functions
const calculateTransforms = (dragOffset: DragState, index: number, isAnimatingOut: boolean, exitDirection: 'left' | 'right' | null) => {
  // Drag rotation
  const dragRotation = index === 0 && !isAnimatingOut 
    ? Math.max(-1, Math.min(1, dragOffset.x / 200)) * 12 
    : index * 1.2;

  // Exit transform
  const exitTransform = exitDirection ? {
    x: exitDirection === 'right' ? 600 : -600,
    y: -100,
    rotate: exitDirection === 'right' ? 25 : -25,
    scale: 0.8,
    opacity: 0
  } : {};

  // Active transform
  const activeTransform = {
    x: dragOffset.x,
    y: dragOffset.y,
    rotate: dragRotation,
    scale: 1,
    opacity: 1
  };

  // Stacked transform
  const stackedTransform = {
    x: 0,
    y: index * 8,
    rotate: index * 0.8,
    scale: 0.95 - (index * 0.03),
    opacity: 0.95 - (index * 0.08)
  };

  return { dragRotation, exitTransform, activeTransform, stackedTransform };
};

// Consolidated transition calculation
const calculateTransition = (index: number, isAnimatingOut: boolean, isDragging: boolean): Transition => {
  if (isDragging && index === 0 && !isAnimatingOut) return { duration: 0 };
  
  if (isAnimatingOut) {
    return {
      x: { type: "spring" as const, damping: 20, stiffness: 300, duration: 0.4 },
      y: { type: "spring" as const, damping: 25, stiffness: 250 },
      rotate: { type: "spring" as const, damping: 18, stiffness: 200 },
      scale: { type: "spring" as const, damping: 22, stiffness: 400 },
      opacity: { duration: 0.3, ease: "easeOut" }
    };
  }
  
  return index > 0 
    ? { type: "spring" as const, damping: 25, stiffness: 300, mass: 0.8, duration: 0.6 }
    : { type: "spring" as const, damping: 22, stiffness: 350, mass: 0.7, duration: 0.5 };
};

export const useProfileCardDragLogic = ({ 
  index, 
  onSwipe, 
  setIsDragging 
}: ProfileCardDragLogicProps) => {
  const [dragOffset, setDragOffset] = useState<DragState>({ x: 0, y: 0 });
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null);

  const handleDragStart = useCallback(() => {
    if (index === 0) setIsDragging(true);
  }, [index, setIsDragging]);

  const checkSwipeThreshold = useCallback((info: PanInfo) => {
    const threshold = 100;
    const velocity = Math.abs(info.velocity.x);
    const distance = Math.abs(info.offset.x);
    return distance > threshold || velocity > 600;
  }, []);

  const handleDrag = useCallback((_event: unknown, info: PanInfo) => {
    if (index === 0 && !isAnimatingOut) {
      setDragOffset({ 
        x: info.offset.x, 
        y: info.offset.y * 0.2 
      });
    }
  }, [index, isAnimatingOut]);

  const handleDragEnd = useCallback((_event: unknown, info: PanInfo) => {
    if (index !== 0 || isAnimatingOut) return;
    setIsDragging(false);
    
    const shouldSwipe = checkSwipeThreshold(info);
    if (shouldSwipe) {
      const direction = info.offset.x > 0 ? 'right' : 'left';
      console.log(`Drag ended with swipe: ${direction}`);
      
      setIsAnimatingOut(true);
      setExitDirection(direction);
      
      // Call the swipe callback immediately to trigger profile advancement
      onSwipe(direction);
      
      // Reset drag state after animation with Tinder-like timing
      setTimeout(() => {
        setDragOffset({ x: 0, y: 0 });
        setIsAnimatingOut(false);
        setExitDirection(null);
      }, 500); // Reduced from 600ms for snappier feel
    } else {
      // Smooth return to center for failed swipes
      setDragOffset({ x: 0, y: 0 });
    }
  }, [index, isAnimatingOut, setIsDragging, onSwipe, checkSwipeThreshold]);

  const getCardTransform = useCallback(() => {
    const { exitTransform, activeTransform, stackedTransform } = calculateTransforms(dragOffset, index, isAnimatingOut, exitDirection);
    
    if (isAnimatingOut && index === 0) return exitTransform;
    if (index === 0) return activeTransform;
    return stackedTransform;
  }, [dragOffset, index, isAnimatingOut, exitDirection]);

  const getTransition = useCallback((isDragging: boolean): Transition => {
    return calculateTransition(index, isAnimatingOut, isDragging);
  }, [index, isAnimatingOut]);

  return {
    dragOffset,
    isAnimatingOut,
    exitDirection,
    handleDragStart,
    handleDrag,
    handleDragEnd,
    getCardTransform,
    getTransition,
  };
};
