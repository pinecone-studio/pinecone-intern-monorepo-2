import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Profile } from './MockData';
import { SwipeOverlay } from './SwipeOverlay';

const calculateAge = (dateOfBirth: string): number => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

interface ProfileCardProps {
  profile: Profile;
  index: number;
  onSwipe: (direction: 'left' | 'right') => void;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
  isExiting?: boolean;
}

const ProfileInfo: React.FC<{ profile: Profile }> = ({ profile }) => (
  <>
    <div className="absolute bottom-28 left-6 right-6 text-white">
      <h2 className="text-3xl font-bold mb-2 drop-shadow-lg">
        {profile.name} <span className="font-light">{calculateAge(profile.dateOfBirth)}</span>
      </h2>
      <p className="text-white/90 text-lg font-medium drop-shadow-md mb-2">{profile.profession}</p>
    </div>
    <div className="absolute bottom-6 left-6 right-6 text-white">
      <p className="text-white/90 text-sm leading-relaxed mb-2 drop-shadow-md">{profile.bio}</p>
      <div className="flex flex-wrap gap-2">
        {profile.interests.slice(0, 3).map((interest, idx) => (
          <span key={idx} className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs font-medium border border-white/30">
            {interest}
          </span>
        ))}
      </div>
    </div>
  </>
);

const ProfileCardComponent = React.forwardRef<HTMLDivElement, ProfileCardProps>(
  ({ profile, index, onSwipe, isDragging, setIsDragging, isExiting = false }, ref) => {
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [isAnimatingOut, setIsAnimatingOut] = useState(false);
    const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null);

    const handleDragStart = useCallback(() => {
      if (index === 0) setIsDragging(true);
    }, [index, setIsDragging]);

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
      const threshold = 100;
      const velocity = Math.abs(info.velocity.x);
      const distance = Math.abs(info.offset.x);
      if (distance > threshold || velocity > 600) {
        const _direction = info.offset.x > 0 ? 'right' : 'left';
        setIsAnimatingOut(true);
        setExitDirection(_direction);
        
        setTimeout(() => onSwipe(_direction), 100);
      } else {
        setDragOffset({ x: 0, y: 0 });
      }
    }, [index, isAnimatingOut, setIsDragging, onSwipe]);

    const getDragRotation = useCallback(() => {
      if (index === 0 && !isAnimatingOut) {
        const maxRotation = 12;
        const normalizedX = Math.max(-1, Math.min(1, dragOffset.x / 200));
        return normalizedX * maxRotation;
      }
      return index * 1.2;
    }, [index, isAnimatingOut, dragOffset.x]);

    const getExitTransform = useCallback(() => {
      const exitX = exitDirection === 'right' ? 500 : -500;
      const exitRotation = exitDirection === 'right' ? 20 : -20;
      return { x: exitX, y: 0, rotate: exitRotation, scale: 0.9, opacity: 0 };
    }, [exitDirection]);

    const getActiveTransform = useCallback(() => {
      return { 
        x: dragOffset.x, 
        y: dragOffset.y, 
        rotate: getDragRotation(), 
        scale: 1, 
        opacity: 1 
      };
    }, [dragOffset.x, dragOffset.y, getDragRotation]);

    const getStackedTransform = useCallback(() => {
      const baseScale = 0.96 - (index * 0.02);
      const baseY = index * 10;
      return { x: 0, y: baseY, rotate: index * 1, scale: baseScale, opacity: 0.9 - (index * 0.1) };
    }, [index]);

    const getCardTransform = useCallback(() => {
      if (isAnimatingOut && index === 0) {
        return getExitTransform();
      }
      if (index === 0) {
        return getActiveTransform();
      }
      return getStackedTransform();
    }, [isAnimatingOut, index, getExitTransform, getActiveTransform, getStackedTransform]);

    const transform = getCardTransform();
    const dragDistance = Math.abs(dragOffset.x);
    const showOverlay = index === 0 && dragDistance > 50 && !isAnimatingOut && !isExiting;
    const overlayOpacity = Math.min((dragDistance - 50) / 100, 0.8);

    return (
      <motion.div
        ref={ref}
        className="absolute w-[600px] bg-white rounded-xl overflow-hidden cursor-grab active:cursor-grabbing select-none"
        style={{
          height: '800px',
          zIndex: 10 - index,
          left: '43%',
          top: '70%',
          marginLeft: '-160px',
          marginTop: '-300px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }}
        initial={{ ...transform }}
        animate={transform}
        drag={index === 0 && !isAnimatingOut ? true : false}
        dragConstraints={{ left: -250, right: 250, top: -50, bottom: 50 }}
        dragElastic={0}
        dragMomentum={false}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        transition={
          isDragging && index === 0 && !isAnimatingOut
            ? { duration: 0 }
            : isAnimatingOut
            ? {
                x: { type: "spring", damping: 15, stiffness: 500, duration: 0.2 },
                rotate: { type: "spring", damping: 15, stiffness: 400 },
                scale: { type: "spring", damping: 20, stiffness: 600 },
                opacity: { duration: 0.15, ease: "easeOut" }
              }
            : { type: "spring", damping: 20, stiffness: 500, mass: 0.6 }
        }
      >
        <div className="relative h-full overflow-hidden">
          <img
            src={profile.images[0]}
            alt={profile.name}
            className="w-full h-full object-cover"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <ProfileInfo profile={profile} />
          <AnimatePresence>
            {showOverlay && (
              <SwipeOverlay 
                direction={dragOffset.x < 0 ? 'left' : 'right'} 
                opacity={overlayOpacity} 
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  }
);

ProfileCardComponent.displayName = 'ProfileCard';

export const ProfileCard = ProfileCardComponent;