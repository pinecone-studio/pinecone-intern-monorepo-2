"use client";

import React, { useState, useRef, useEffect } from "react";
import { useChat } from "@/hooks/useChat";
import { useTinderSwipe } from "@/hooks/useTinderSwipe";
import { ConversationsList } from "@/components/chat/ConversationList";
import MatchedUser from "@/components/chat/MatchedUser";
import Header from "@/components/chat/Header";
import ProfilePreviewModal from "@/components/chat/ProfilePreviewModal";
import SwipeComponent, { SwipeComponentRef } from "@/components/chat/SwipeComponent";
import ChatArea from "@/components/chat/ChatArea";
import ProfileView from "@/components/chat/ProfileView";
import { useUser } from "@/contexts";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/auth/AuthGuard";

function MainLayout({ children }: { children: React.ReactNode }) {
    const { user } = useUser();
    const [activeTab, setActiveTab] = useState("matches");
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [viewMode, setViewMode] = useState("chat"); // "chat", "profile", "swipe"
    const swipeComponentRef = useRef<SwipeComponentRef>(null);

    const currentUserId = user?.id || "";
    const { selectedUser, setSelectedUser, messages, newMessage, setNewMessage, profileData, profileLoading, profileError, messagesLoading, messagesEndRef, handleSendMessage, fetchMessages } = useChat(currentUserId);
    const { profiles, currentIndex, matchedProfile, matches, isDragging, animatingCards, loading, error, handleSwipe, handleDislike, handleLike, handleSuperLike, handleKeepSwiping, handleMessage, refetch, refetchProfile } = useTinderSwipe(currentUserId);

    // Convert Profile[] to MatchProfile[] for SwipeComponent
    const profilesForSwipe = profiles.map(profile => ({
        __typename: 'MatchProfile' as const,
        id: profile.id,
        userId: profile.userId,
        name: profile.name,
        bio: profile.bio,
        interests: profile.interests,
        profession: profile.profession,
        work: profile.work,
        dateOfBirth: profile.dateOfBirth,
        images: profile.images,
    }));

    const handleUserSelect = (user: any) => {
        setSelectedUser(user);
        setViewMode("chat"); // Switch to chat view when user is selected
    };

    const handleMessageUserClick = (userId: string) => {
        const user = profileData?.getProfile?.matches?.find((match: any) => match.userId === userId);
        if (user) {
            setSelectedUser(user);
            setViewMode("chat"); // Switch to chat view
        }
    };

    const handleProfileClick = () => {
        // Cycle through view modes: chat -> swipe -> profile -> chat
        if (viewMode === "chat") {
            setViewMode("swipe");
        } else if (viewMode === "swipe") {
            setViewMode("profile");
        } else if (viewMode === "profile") {
            setViewMode("chat");
        }
    };

    const handleProfileSave = (updatedProfile: any) => {
        // Here you would typically make an API call to update the profile
        console.log("Profile updated:", updatedProfile);
        setShowProfileModal(false);
    };

    // Handle match detection - show match modal when there's an actual match
    useEffect(() => {
        if (matchedProfile && swipeComponentRef.current) {
            // Convert Profile to MatchProfile format
            const matchProfile = {
                __typename: 'MatchProfile' as const,
                id: matchedProfile.id,
                userId: matchedProfile.userId,
                name: matchedProfile.name,
                bio: matchedProfile.bio,
                interests: matchedProfile.interests,
                profession: matchedProfile.profession,
                work: matchedProfile.work,
                dateOfBirth: matchedProfile.dateOfBirth,
                images: matchedProfile.images,
            };
            swipeComponentRef.current.showMatch(matchProfile);
        }
    }, [matchedProfile]);

    if (profileLoading) return <div className="p-6 text-center">Loading profile...</div>;
    if (profileError) return <div className="p-6 text-center text-red-500">Error loading profile: {profileError.message}</div>;

    // Debug logging
    console.log('=== DEBUG INFO ===');
    console.log('currentUserId:', currentUserId);
    console.log('profileData?.getProfile?.matches:', profileData?.getProfile?.matches);
    console.log('profiles from useTinderSwipe:', profiles);
    console.log('profilesForSwipe:', profilesForSwipe);
    console.log('loading:', loading);
    console.log('error:', error);
    console.log('==================');

    return (
        <AuthGuard>
            <div className="w-full h-screen flex overflow-hidden">
                {/* Sidebar */}
                <div className="w-1/4 border-r flex flex-col overflow-hidden bg-white">
                    <Header
                        currentUserProfile={profileData?.getProfile}
                        profileLoading={profileLoading}
                        onProfileClick={handleProfileClick}
                    />

                    {/* Tab Toggle */}
                    <div className="flex border-b flex-shrink-0">
                        <button
                            onClick={() => setActiveTab("matches")}
                            className={`flex-1 py-3 px-4 text-sm font-medium ${activeTab === "matches"
                                ? "bg-pink-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            Matches
                        </button>
                        <button
                            onClick={() => setActiveTab("messages")}
                            className={`flex-1 py-3 px-4 text-sm font-medium ${activeTab === "messages"
                                ? "bg-pink-600 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            Messages
                        </button>
                    </div>

                    {/* Content based on active tab */}
                    <div className="flex-1 overflow-hidden">
                        {activeTab === "matches" ? (
                            <MatchedUser onUserSelect={handleUserSelect} currentUserId={currentUserId} />
                        ) : (
                            <ConversationsList
                                matches={profileData?.getProfile?.matches || []}
                                selectedUser={selectedUser}
                                onUserSelect={handleUserSelect}
                                onUserClick={handleMessageUserClick}
                            />
                        )}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-hidden">
                    {showProfileModal ? (
                        <ProfilePreviewModal
                            onClose={() => setShowProfileModal(false)}
                            profile={profileData?.getProfile}
                            profileLoading={profileLoading}
                            onSave={handleProfileSave}
                        />
                    ) : viewMode === "swipe" ? (
                        <div className="w-full h-full">
                            <SwipeComponent
                                ref={swipeComponentRef}
                                onClose={() => setViewMode("chat")}
                                matches={profilesForSwipe}
                                onMatchClick={(match) => {
                                    setSelectedUser(match);
                                    setViewMode("chat");
                                }}
                                onSwipe={(direction, match) => {
                                    handleSwipe(direction);
                                }}
                                currentUserId={currentUserId}
                            />
                        </div>
                    ) : viewMode === "profile" ? (
                        <ProfilePreviewModal
                            onClose={() => setViewMode("chat")}
                            profile={profileData?.getProfile}
                            profileLoading={profileLoading}
                            onSave={handleProfileSave}
                        />
                    ) : viewMode === "chat" && selectedUser ? (
                        <div className="h-full flex">
                            <div className="w-3/5">
                                <ChatArea
                                    selectedUser={selectedUser}
                                    messages={messages}
                                    messagesLoading={messagesLoading}
                                    newMessage={newMessage}
                                    setNewMessage={setNewMessage}
                                    handleSendMessage={handleSendMessage}
                                    messagesEndRef={messagesEndRef as React.RefObject<HTMLDivElement>}
                                    currentUserId={currentUserId}
                                    onUserClick={handleMessageUserClick}
                                />
                            </div>
                            <div className="w-2/5">
                                <ProfileView selectedUser={selectedUser} />
                            </div>
                        </div>
                    ) : (
                        children
                    )}
                </div>
            </div>
        </AuthGuard>
    );
}
export default MainLayout;