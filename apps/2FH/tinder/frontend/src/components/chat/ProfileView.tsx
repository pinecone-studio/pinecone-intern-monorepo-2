"use client";

import React, { useState } from "react";

interface ProfileViewProps {
    selectedUser?: {
        id?: string;
        userId?: string;
        name?: string;
        gender?: string;
        bio?: string;
        interests?: string[];
        interestedIn?: string;
        profession?: string;
        work?: string;
        images?: string[];
        dateOfBirth?: string;
        verified?: boolean;
    } | null;
}

const ProfileView: React.FC<ProfileViewProps> = ({ selectedUser }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextImage = () => {
        if (selectedUser?.images && selectedUser.images.length > 0) {
            setCurrentImageIndex((prev) =>
                prev === selectedUser.images!.length - 1 ? 0 : prev + 1
            );
        }
    };

    const prevImage = () => {
        if (selectedUser?.images && selectedUser.images.length > 0) {
            setCurrentImageIndex((prev) =>
                prev === 0 ? selectedUser.images!.length - 1 : prev - 1
            );
        }
    };

    if (!selectedUser) {
        return (
            <div className="w-full h-full flex items-center overflow-y-auto justify-center bg-gray-50">
                <div className="text-center text-gray-500">
                    <div className="text-6xl mb-4">👤</div>
                    <p className="text-xl">Select a match to view profile</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full bg-white flex flex-col overflow-hidden relative">
            {/* Profile Header */}
            <div className="p-4 border-b border-gray-200 flex-shrink-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-gray-900">{selectedUser.name}</h2>
                        <span className="text-lg text-gray-600">
                            {selectedUser.dateOfBirth
                                ? new Date().getFullYear() - new Date(selectedUser.dateOfBirth).getFullYear()
                                : 25
                            }
                        </span>
                        {selectedUser.verified && (
                            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">✓</span>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-full">
                            <span className="text-gray-600">⋯</span>
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-full">
                            <span className="text-gray-600">✕</span>
                        </button>
                    </div>
                </div>
                {/* Progress dots */}
                <div className="flex gap-1 justify-between mt-10 absolute top-10 left-0 right-0 z-10">
                    {selectedUser.images && selectedUser.images.length > 0 ? (
                        selectedUser.images.map((_, index) => (
                            <div
                                key={index}
                                className={`w-20 h-1  ${index === currentImageIndex
                                    ? 'bg-gray-500'
                                    : 'bg-white border border-gray-300'
                                    }`}
                            />
                        ))
                    ) : (
                        <div className="w-2 h-2 bg-gray-300 rounded-full" />
                    )}
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
                {/* Profile Image Carousel */}
                <div className="relative h-[950px]">

                    <img
                        src={selectedUser.images?.[currentImageIndex] || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                        alt={selectedUser.name}
                        className="w-full h-full object-cover"
                    />

                    {/* Navigation Arrows */}
                    {selectedUser.images && selectedUser.images.length > 1 && (
                        <>
                            {/* Left Arrow */}
                            <button
                                onClick={prevImage}
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center transition-colors"
                            >
                                <span className="text-white text-xl">‹</span>
                            </button>

                            {/* Right Arrow */}
                            <button
                                onClick={nextImage}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center transition-colors"
                            >
                                <span className="text-white text-xl">›</span>
                            </button>
                        </>
                    )}

                    {/* Image Counter */}
                    {selectedUser.images && selectedUser.images.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                            {currentImageIndex + 1} / {selectedUser.images.length}
                        </div>
                    )}

                </div>

                {/* Profile Details */}
                <div className="p-4 space-y-4">
                    {/* Bio */}
                    {selectedUser.bio && (
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                <span className="text-gray-600 text-sm">˙ᵕ˙</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">About me</p>
                                <p className="text-sm text-gray-700 mt-1">{selectedUser.bio}</p>
                            </div>
                        </div>
                    )}

                    {/* Interested In */}
                    {selectedUser.interestedIn && (
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                <span className="text-gray-600 text-sm">🔍</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">Interested in</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-pink-500">💖</span>
                                    <span className="text-sm text-gray-700">{selectedUser.interestedIn}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Work */}
                    {selectedUser.work && (
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                <span className="text-gray-600 text-sm">💼</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">Work</p>
                                <p className="text-sm text-gray-700 mt-1">{selectedUser.work}</p>
                            </div>
                        </div>
                    )}

                    {/* Profession */}
                    {selectedUser.profession && (
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                <span className="text-gray-600 text-sm">🎓</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">Profession</p>
                                <p className="text-sm text-gray-700 mt-1">{selectedUser.profession}</p>
                            </div>
                        </div>
                    )}

                    {/* Gender */}
                    {selectedUser.gender && (
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                <span className="text-gray-600 text-sm">👤</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">Gender</p>
                                <p className="text-sm text-gray-700 mt-1">{selectedUser.gender}</p>
                            </div>
                        </div>
                    )}

                    {/* Interests */}
                    {selectedUser.interests && selectedUser.interests.length > 0 && (
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                <span className="text-gray-600 text-sm">❤️</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">Interests</p>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {selectedUser.interests.map((interest, index) => (
                                        <span
                                            key={index}
                                            className="px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs"
                                        >
                                            {interest}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* No information message */}
                    {!selectedUser.bio && !selectedUser.interestedIn && !selectedUser.work &&
                        !selectedUser.profession && !selectedUser.gender &&
                        (!selectedUser.interests || selectedUser.interests.length === 0) && (
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                    <span className="text-gray-600 text-sm">👤</span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Essentials</p>
                                    <p className="text-sm text-gray-500 mt-1">No information added</p>
                                </div>
                            </div>
                        )}
                </div>
            </div>
        </div>
    );
};

export default ProfileView;