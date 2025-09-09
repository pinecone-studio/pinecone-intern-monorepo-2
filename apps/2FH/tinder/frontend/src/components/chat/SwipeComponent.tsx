"use client";

import React, { useState, useImperativeHandle, forwardRef } from "react";
import { motion, PanInfo, useMotionValue, useTransform } from "framer-motion";
import { Heart, X, MessageCircle } from "lucide-react";
import { ProfileCard } from "../match/ProfileCard";
import { ActionButtons } from "../match/ActionButtons";
import { MatchModal } from "../match/MatchModal";
import { NoMoreProfiles } from "../match/NoMoreProfiles";
import { Profile, MatchProfile } from "../../generated";
import { useSendMessageMutation } from "../../generated";
import { useUser } from "@/contexts/UserContext";

interface SwipeComponentProps {
    onClose: () => void;
    matches?: MatchProfile[];
    onMatchClick?: (match: MatchProfile) => void;
    onSwipe?: (direction: 'left' | 'right', match: MatchProfile) => void;
    currentUserId?: string;
    onMatchFound?: (match: MatchProfile) => void;
}

export interface SwipeComponentRef {
    showMatch: (match: MatchProfile) => void;
}

const SwipeComponent = forwardRef<SwipeComponentRef, SwipeComponentProps>(({
    onClose,
    matches = [],
    onMatchClick,
    onSwipe,
    currentUserId,
    onMatchFound
}, ref) => {
    const { user } = useUser();
    const actualCurrentUserId = currentUserId || user?.id || "";
    const [currentIndex, setCurrentIndex] = useState(0);
    const [swipedProfiles, setSwipedProfiles] = useState<number[]>([]);
    const [showMatchModal, setShowMatchModal] = useState(false);
    const [matchedProfile, setMatchedProfile] = useState<MatchProfile | null>(null);

    const [sendMessage] = useSendMessageMutation();

    const currentMatch = matches[currentIndex];
    const nextMatch = matches[currentIndex + 1];

    // Debug logging
    console.log('SwipeComponent - matches:', matches);
    console.log('SwipeComponent - currentIndex:', currentIndex);
    console.log('SwipeComponent - currentMatch:', currentMatch);
    console.log('SwipeComponent - nextMatch:', nextMatch);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotate = useTransform(x, [-300, 300], [-30, 30]);
    const opacity = useTransform(x, [-300, -150, 0, 150, 300], [0, 1, 1, 1, 0]);

    // Swipe indicator transforms - moved to top level to avoid hooks rule violation
    const swipeIndicatorOpacity = useTransform(x, [-100, 0, 100], [1, 0, 1]);
    const nopeOpacity = useTransform(x, [-50, -100], [0, 1]);
    const nopeScale = useTransform(x, [-50, -100], [0.5, 1]);
    const likeOpacity = useTransform(x, [50, 100], [0, 1]);
    const likeScale = useTransform(x, [50, 100], [0.5, 1]);

    const handleDragEnd = (event: any, info: PanInfo) => {
        const threshold = 100;
        const velocity = info.velocity.x;

        if (Math.abs(info.offset.x) > threshold || Math.abs(velocity) > 500) {
            const direction = info.offset.x > 0 ? 'right' : 'left';
            handleSwipe(direction);
        } else {
            // Snap back to center with smooth animation
            x.set(0);
            y.set(0);
        }
    };

    const handleSwipe = (direction: 'left' | 'right') => {
        if (onSwipe && currentMatch) {
            onSwipe(direction, currentMatch);
        }

        // Only show match modal for right swipes if there's an actual match
        // The match modal should only be shown when the backend confirms a match
        if (direction === 'right') {
            setSwipedProfiles(prev => [...prev, currentIndex]);
            // Don't show match modal here - wait for backend response
        }

        // Animate card exit with fly-off effect
        const exitX = direction === 'right' ? 1000 : -1000;
        const exitY = -200; // Add upward movement for fly-off effect

        // Animate the card flying off screen
        x.set(exitX);
        y.set(exitY);

        // Move to next card after animation
        setTimeout(() => {
            if (currentIndex < matches.length - 1) {
                setCurrentIndex(currentIndex + 1);
            } else {
                // Reset to first profile when reaching the end
                setCurrentIndex(0);
            }

            // Reset position
            x.set(0);
            y.set(0);
        }, 500); // Increased duration for better fly-off effect
    };

    const handleMatchClick = () => {
        if (onMatchClick && currentMatch) {
            onMatchClick(currentMatch);
        }
    };

    const handleMatchModalClose = () => {
        setShowMatchModal(false);
        setMatchedProfile(null);
    };

    // Function to show match modal when there's an actual match
    const showMatch = (match: MatchProfile) => {
        setMatchedProfile(match);
        setShowMatchModal(true);
        if (onMatchFound) {
            onMatchFound(match);
        }
    };

    // Expose showMatch function to parent component
    useImperativeHandle(ref, () => ({
        showMatch
    }));

    const handleSendMessage = async (message: string) => {
        if (!matchedProfile || !actualCurrentUserId) return;

        try {
            await sendMessage({
                variables: {
                    input: {
                        senderId: actualCurrentUserId,
                        receiverId: matchedProfile.userId,
                        content: message
                    }
                }
            });

            // Navigate to chat after sending message
            if (onMatchClick) {
                onMatchClick(matchedProfile);
            }
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setShowMatchModal(false);
            setMatchedProfile(null);
        }
    };

    const handleDislike = () => handleSwipe('left');
    const handleLike = () => handleSwipe('right');
    const handleSuperLike = () => handleSwipe('right');
    const handleRewind = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };
    const handleBoost = () => {
        // Boost functionality - could be implemented later
        console.log('Boost activated');
    };

    if (!currentMatch) {
        return (
            <NoMoreProfiles
                setCurrentIndex={setCurrentIndex}
                onClose={onClose}
            />
        );
    }
    return (
        <div className="w-full h-full bg-gradient-to-br from-pink-50 to-red-50 flex flex-col overflow-hidden relative">
            {/* Match Modal */}
            <MatchModal
                isOpen={showMatchModal}
                onClose={handleMatchModalClose}
                matchedProfile={matchedProfile}
                onSendMessage={handleSendMessage}
            />
            <div className="flex-1 flex items-center justify-center p-4 relative">
                {/* Next Card (Background) */}
                {nextMatch && (
                    <motion.div
                        className="absolute z-10"
                        initial={{ scale: 0.9, y: 20, opacity: 0.8 }}
                        animate={{ scale: 0.95, y: 10, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        <ProfileCard
                            profile={nextMatch}
                            onDislike={() => { }}
                            onLike={() => { }}
                            onSuperLike={() => { }}
                            className="pointer-events-none"
                        />
                    </motion.div>
                )}

                {/* Current Card (Foreground) */}
                <motion.div
                    key={currentIndex}
                    className="relative z-20 cursor-grab active:cursor-grabbing"
                    style={{
                        x,
                        y,
                        rotate,
                        opacity
                    }}
                    drag
                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    dragElastic={0.2}
                    onDragEnd={handleDragEnd}
                    whileDrag={{ scale: 1.05 }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                        x: { type: "spring", stiffness: 200, damping: 20 },
                        y: { type: "spring", stiffness: 200, damping: 20 }
                    }}
                    initial={{ scale: 1, opacity: 1, y: 0 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{
                        x: 1000,
                        y: -200,
                        rotate: 30,
                        opacity: 0,
                        scale: 0.8,
                        transition: { duration: 0.5, ease: "easeInOut" }
                    }}
                >
                    <ProfileCard
                        profile={currentMatch}
                        onDislike={() => handleSwipe('left')}
                        onLike={() => handleSwipe('right')}
                        onSuperLike={() => handleSwipe('right')}
                        onRewind={() => {
                            if (currentIndex > 0) {
                                setCurrentIndex(currentIndex - 1);
                            }
                        }}
                    />

                    {/* Swipe Indicators */}
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        style={{ opacity: swipeIndicatorOpacity }}
                    >
                        <motion.div
                            className="absolute left-8 top-3 transform -translate-y-1/2"
                            style={{
                                opacity: nopeOpacity,
                                scale: nopeScale
                            }}
                        >
                            <div className="bg-red-500 text-white px-6 py-3 rounded-full text-2xl font-bold rotate-12">
                                NOPE
                            </div>
                        </motion.div>
                        <motion.div
                            className="absolute right-8 top-3 transform -translate-y-1/2"
                            style={{
                                opacity: likeOpacity,
                                scale: likeScale
                            }}
                        >
                            <div className="bg-green-500 text-white px-6 py-3 rounded-full text-2xl font-bold -rotate-12">
                                LIKE
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
            {/* Action Buttons */}
            <div className="bg-transparent absolute bottom-10 left-0 right-0 z-50 mb-[40px]">
                <ActionButtons
                    onDislike={handleDislike}
                    onLike={handleLike}
                    onSuperLike={handleSuperLike}
                    onRewind={handleRewind}
                    onBoost={handleBoost}
                />
            </div>
        </div>
    );
});

SwipeComponent.displayName = 'SwipeComponent';

export default SwipeComponent;