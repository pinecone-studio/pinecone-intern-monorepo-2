import React, { forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Profile } from './MockData';
import { SwipeOverlay } from './SwipeOverlay';
import { ProfileInfo } from './ProfileInfo';
import { useProfileCardDragLogic } from './ProfileCardDragLogic';

interface ProfileCardProps {
  profile: Profile;
  index: number;
  _onSwipe: (_direction: 'left' | 'right') => void;
  _isDragging: boolean;
  setIsDragging: (_dragging: boolean) => void;
  isExiting?: boolean;
}

const ProfileCardComponent = forwardRef<HTMLDivElement, ProfileCardProps>(
  ({ profile, index, _onSwipe, _isDragging, setIsDragging, isExiting = false }, ref) => {
    const {
      dragOffset,
      isAnimatingOut,
      handleDragStart,
      handleDrag,
      handleDragEnd,
      getCardTransform,
      getTransition,
    } = useProfileCardDragLogic({ index, onSwipe: _onSwipe, setIsDragging });

    const transform = getCardTransform();
    const dragDistance = Math.abs(dragOffset.x);
    const showOverlay = index === 0 && dragDistance > 50 && !isAnimatingOut && !isExiting;
    const overlayOpacity = Math.min((dragDistance - 50) / 100, 0.8);

    const getCardStyle = () => ({
      height: '800px',
      zIndex: 10 - index,
      left: '43%',
      top: '70%',
      marginLeft: '-160px',
      marginTop: '-300px',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
    });

    // Enhanced initial animation for smooth card entrance like Tinder
    const getInitialAnimation = () => {
      if (index === 0) {
        return { 
          scale: 0.9, 
          opacity: 0, 
          y: 20,
          rotate: 0
        };
      }
      // Stacked cards start slightly offset for natural feel
      return { 
        scale: 0.85, 
        opacity: 0, 
        y: 30 + (index * 5),
        rotate: index * 0.5
      };
    };

    // Get hover and tap animations for active card only
    const getInteractionAnimations = () => {
      if (index !== 0) return {};
      
      return {
        whileHover: { 
          scale: 1.02,
          transition: { duration: 0.2, ease: "easeOut" as const }
        },
        whileTap: { 
          scale: 0.98,
          transition: { duration: 0.1, ease: "easeOut" as const }
        }
      };
    };

    const getMotionProps = () => ({
      ref,
      className: "absolute w-[600px] bg-white rounded-xl overflow-hidden cursor-grab active:cursor-grabbing select-none",
      style: getCardStyle(),
      initial: getInitialAnimation(),
      animate: transform,
      exit: index === 0 ? getCardTransform() : undefined,
      drag: index === 0 && !isAnimatingOut ? true : false,
      dragConstraints: { left: -250, right: 250, top: -50, bottom: 50 },
      dragElastic: 0.1,
      dragMomentum: false,
      onDragStart: handleDragStart,
      onDrag: handleDrag,
      onDragEnd: handleDragEnd,
      transition: getTransition(_isDragging),
      ...getInteractionAnimations(),
    });

    const getOverlayDirection = () => dragOffset.x < 0 ? 'left' : 'right';

    return (
      <motion.div {...getMotionProps()}>
        <div className="relative h-full overflow-hidden">
          <motion.img
            src={profile.images[0]}
            alt={profile.name}
            className="w-full h-full object-cover"
            draggable={false}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ 
              duration: 0.6, 
              ease: "easeOut",
              delay: index * 0.1 
            }}
          />
          <motion.div 
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ 
              duration: 0.4, 
              ease: "easeOut",
              delay: index * 0.1 + 0.2 
            }}
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.5, 
              ease: "easeOut",
              delay: index * 0.1 + 0.3 
            }}
          >
            <ProfileInfo profile={profile} />
          </motion.div>
          <AnimatePresence>
            {showOverlay && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: overlayOpacity, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <SwipeOverlay 
                  direction={getOverlayDirection()} 
                  opacity={overlayOpacity} 
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  }
);

ProfileCardComponent.displayName = 'ProfileCard';

export const ProfileCard = ProfileCardComponent;