"use client";

import React, { useState } from "react";
import { useChat } from "@/hooks/useChat";
import { useTinderSwipe } from "@/hooks/useTinderSwipe";
import { ConversationsList } from "./ConversationList";
import MatchedUser from "./MatchedUser";
import Header from "./Header";
import ProfileView from "./ProfileView";
import ChatArea from "./ChatArea";
import ProfilePreviewModal from "./ProfilePreviewModal";
import SwipeComponent from "./SwipeComponent";
import { useUser } from "@/contexts/UserContext";

export default function ChatHistory() {
    const { user } = useUser();
    const currentUserId = user?.id || "";
    const [activeTab, setActiveTab] = useState("matches");
    const [viewMode, setViewMode] = useState("chat"); // "chat", "profile", "swipe"

    // Don't render if no user
    if (!user) {
        return <div className="p-6 text-center">Loading...</div>;
    }


    function ChatHistoryContent({
        currentUserId,
        activeTab,
        setActiveTab,
        viewMode,
        setViewMode
    }: {
        currentUserId: string;
        activeTab: string;
        setActiveTab: (tab: string) => void;
        viewMode: string;
        setViewMode: (mode: string) => void;
    }) {
        const { selectedUser, setSelectedUser, messages, newMessage, setNewMessage, profileData, profileLoading, profileError, messagesLoading, messagesEndRef, handleSendMessage, fetchMessages } = useChat(currentUserId);
        const { profiles, handleSwipe } = useTinderSwipe(currentUserId);

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
            setViewMode("chat"); // Ensure chat view is shown
            fetchMessages(user.userId);
        };

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
            } else {
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

        const handleMatchClick = (match: any) => {
            setSelectedUser(match);
            fetchMessages(match.userId);
            setViewMode("chat");
        };

        if (profileLoading) return <div className="p-6 text-center">Loading profile...</div>;
        if (profileError) return <div className="p-6 text-center text-red-500">Error loading profile: {profileError.message}</div>;

        return (
            <div className="w-full h-screen flex flex-col overflow-hidden">
                {/* Header */}

                <div className="flex flex-1 overflow-hidden">
                    <div className="w-1/4 border-r flex flex-col overflow-hidden">
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
                                <ConversationsList matches={profileData?.getProfile?.matches || []} selectedUser={selectedUser} onUserSelect={handleUserSelect} />
                            )}
                        </div>
                    </div>
                    <div className="flex flex-1">
                        {viewMode === "chat" ? (
                            <>
                                <div className="w-3/4">
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
                                <div className="w-1/4">
                                    <ProfileView selectedUser={selectedUser} />
                                </div>
                            </>
                        ) : viewMode === "profile" ? (
                            <div className="flex-1">
                                <SwipeComponent
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
                        ) : (
                            <div className="w-full">
                                <ProfilePreviewModal
                                    onClose={() => setViewMode("chat")}
                                    profile={profileData?.getProfile}
                                    profileLoading={profileLoading}
                                    onSave={handleProfileSave}
                                />
                            </div>
                        )}
                    </div>
                </div>

            </div>
        );
    }

    return (
        <ChatHistoryContent
            currentUserId={currentUserId}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            viewMode={viewMode}
            setViewMode={setViewMode}
        />
    );
}