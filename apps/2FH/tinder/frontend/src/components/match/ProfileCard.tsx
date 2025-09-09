import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MatchProfile } from '../../generated';
import { ProfileInfo } from './ProfileInfo';

interface ProfileCardProps {
    profile: MatchProfile;
    onDislike: () => void;
    onLike: () => void;
    onSuperLike: () => void;
    onRewind?: () => void;
    onBoost?: () => void;
    style?: React.CSSProperties;
    className?: string;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
    profile,
    onDislike,
    onLike,
    onSuperLike,
    onRewind,
    onBoost,
    style,
    className = ""
}) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const images = profile.images || [];

    const nextImage = () => {
        if (images.length > 1) {
            setCurrentImageIndex((prev) => (prev + 1) % images.length);
        }
    };

    const prevImage = () => {
        if (images.length > 1) {
            setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
        }
    };

    return (
        <motion.div
            className={`relative w-[600px] h-[850px] mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden ${className}`}
            style={style}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            {/* Image Container */}
            <div className="relative w-full h-full min-h-[600px]">
                {/* Main Image */}
                <img
                    src={images[currentImageIndex] || "https://via.placeholder.com/400x600"}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                />

                {/* Image Progress Indicators */}
                {images.length > 1 && (
                    <div className="absolute top-4 left-4 right-4 flex gap-1">
                        {images.map((_, index) => (
                            <div
                                key={index}
                                className={`h-1 flex-1 rounded-full transition-all duration-300 ${index === currentImageIndex
                                    ? 'bg-white'
                                    : 'bg-white/30'
                                    }`}
                            />
                        ))}
                    </div>
                )}
                <ProfileInfo profile={profile} />



                {/* Image Navigation (Hidden buttons for touch/swipe) */}
                <div className="absolute inset-0 flex">
                    <button
                        onClick={prevImage}
                        className="w-1/2 h-full cursor-pointer"
                        aria-label="Previous image"
                    />
                    <button
                        onClick={nextImage}
                        className="w-1/2 h-full cursor-pointer"
                        aria-label="Next image"
                    />
                </div>
            </div>
        </motion.div>
    );
};