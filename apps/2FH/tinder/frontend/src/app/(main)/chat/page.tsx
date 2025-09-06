"use client";

import React, { useState, useRef, useEffect } from "react";
import { useChat } from "@/hooks/useChat";
import { useTinderSwipe } from "@/hooks/useTinderSwipe";
import { useUser } from "@/contexts";
import ChatArea from "@/components/chat/ChatArea";
import ProfileView from "@/components/chat/ProfileView";
import ProfilePreviewModal from "@/components/chat/ProfilePreviewModal";
import SwipeComponent, { SwipeComponentRef } from "@/components/chat/SwipeComponent";

const ChatPage = () => {
    const { user, isAuthenticated } = useUser();
    const currentUserId = user?.id || "";
    const [viewMode, setViewMode] = useState("swipe"); // "chat", "profile", "swipe"
    const swipeComponentRef = useRef<SwipeComponentRef>(null);
    const { selectedUser, setSelectedUser, messages, newMessage, setNewMessage, profileData, profileLoading, profileError, messagesLoading, messagesEndRef, handleSendMessage, fetchMessages } = useChat(currentUserId);
    const { profiles, matchedProfile, handleSwipe } = useTinderSwipe(currentUserId);

    // Show error if user is not authenticated
    if (!isAuthenticated || !user || !currentUserId) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-lg text-red-500">Please log in to access this page</div>
            </div>
        );
    }

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

    const handleMessageUserClick = (userId: string) => {
        const user = profileData?.getProfile?.matches?.find((match: any) => match.userId === userId);
        if (user) {
            setSelectedUser(user);
            setViewMode("chat"); // Switch back to message view
            // The useChat hook will automatically fetch messages when selectedUser changes
        }
    };

    const handleProfileClick = () => {
        if (viewMode === "chat") {
            setViewMode("profile");
        } else if (viewMode === "profile") {
            setViewMode("swipe");
        } else if (viewMode === "swipe") {
            setViewMode("profile"); // Go back to profile from swipe
        }
    };

    const handleProfileSave = (updatedProfile: any) => {
        // Here you would typically make an API call to update the profile
        console.log("Profile updated:", updatedProfile);
        // Switch back to chat view after saving
        setViewMode("chat");
    };

    const handleSwipeClose = () => {
        setViewMode("chat");
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


    return (
        <div className="h-full flex">
            {viewMode === "chat" ? (
                <>
                    <div className="flex-1">
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
                    <div className="w-2/4">
                        <ProfileView selectedUser={selectedUser} />
                    </div>
                </>
            ) : viewMode === "profile" ? (
                <div className="w-full">
                    <ProfileView selectedUser={selectedUser} />
                </div>
            ) : (
                <div className="w-full">
                    <SwipeComponent
                        ref={swipeComponentRef}
                        onClose={handleSwipeClose}
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
            )}
        </div>
    );
};

export default ChatPage;