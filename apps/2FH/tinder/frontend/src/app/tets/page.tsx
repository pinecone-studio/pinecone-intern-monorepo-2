"use client";

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useGetProfileQuery, useSendMessageMutation, useGetMessagesBetweenUsersLazyQuery } from '@/generated';
import { io, Socket } from 'socket.io-client';

interface MatchedUser {
    id: string;
    userId: string;
    name: string;
    email?: string; // Add email property
    gender: string;
    bio: string;
    interests: string[];
    profession: string;
    work: string;
    images: string[];
    dateOfBirth: string;
    createdAt: string;
    updatedAt: string;
}

interface Message {
    id: string;
    content: string;
    createdAt: string;
    sender?: {
        id: string;
        email?: string;
    } | null;
    receiver?: {
        id: string;
        email?: string;
    } | null;
}

export default function ChatPage() {
    const [selectedUser, setSelectedUser] = useState<MatchedUser | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [currentUserId] = useState('68a564a552cf45602b4c2d60'); // Replace with actual current user ID

    const socketRef = useRef<Socket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Get matched users from getProfile
    const { data: profileData, loading: profileLoading, error: profileError } = useGetProfileQuery({
        variables: { userId: currentUserId },
        skip: !currentUserId
    });

    const [sendMessage] = useSendMessageMutation();

    // Lazy query for fetching messages between users
    const [getMessagesBetweenUsers, { data: messagesData, loading: messagesLoading }] = useGetMessagesBetweenUsersLazyQuery();

    // Auto-scroll to bottom of messages
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    // Scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    // Socket.IO холболт - only create once
    useEffect(() => {
        if (!socketRef.current) {
            socketRef.current = io("http://localhost:4300", { transports: ["websocket"] });

            socketRef.current.on("connect", () => {
                console.log("Socket connected:", socketRef.current?.id);
                socketRef.current?.emit("register", currentUserId);
            });

            socketRef.current.on("newMessage", (msg: any) => {
                // Update conversations with new message
                setMessages(prev => {
                    const newMessages = [...prev];
                    const messageIndex = newMessages.findIndex(m =>
                        m.id === msg.id
                    );

                    if (messageIndex !== -1) {
                        // Update existing message
                        newMessages[messageIndex] = { ...newMessages[messageIndex], ...msg };
                    } else {
                        // Add new message
                        newMessages.push(msg);
                    }

                    return newMessages;
                });

                // Auto-scroll to new message
                setTimeout(scrollToBottom, 100);
            });
        }

        return () => {
            // Only disconnect on unmount, not on re-renders
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [scrollToBottom]); // Add scrollToBottom to dependencies

    // Fetch messages between current user and selected user
    const fetchMessages = useCallback(async (otherUserId: string) => {
        try {
            console.log(`Fetching messages between ${currentUserId} and ${otherUserId}`);

            // Use the actual query to fetch messages between two users
            await getMessagesBetweenUsers({
                variables: {
                    userId1: currentUserId,
                    userId2: otherUserId
                }
            });

        } catch (error) {
            console.error('Error fetching messages:', error);
            setMessages([]);
        }
    }, [currentUserId, getMessagesBetweenUsers]);

    // Load profile data and set first matched user as selected
    useEffect(() => {
        if (profileData?.getProfile?.matches && profileData.getProfile.matches.length > 0) {
            // Auto-select first matched user if no user is selected
            if (!selectedUser) {
                const firstUser = profileData.getProfile.matches[0];
                setSelectedUser(firstUser);
                // Fetch messages for the selected user
                fetchMessages(firstUser.userId);
            }
        }
    }, [profileData, selectedUser, fetchMessages]);

    // Update messages when messagesData changes
    useEffect(() => {
        if (messagesData?.getMessagesBetweenUsers) {
            setMessages(messagesData.getMessagesBetweenUsers);
        }
    }, [messagesData]);

    // Memoized function to prevent recreation on every render
    const handleSendMessage = useCallback(async () => {
        if (!newMessage.trim() || !selectedUser) {
            alert("Please enter a message and select a user!");
            return;
        }

        const receiverId = selectedUser.userId;
        console.log("Sending message with:", { senderId: currentUserId, receiverId, content: newMessage });

        try {
            const { data, errors } = await sendMessage({
                variables: {
                    input: {
                        senderId: currentUserId,
                        receiverId: receiverId,
                        content: newMessage,
                    },
                },
            });

            console.log("Mutation response:", { data, errors }); // Хариуг хэвлэх

            if (errors) {
                console.error("Mutation errors:", errors);
                alert("Failed to send message: " + errors.map((e) => e.message).join(", "));
                return;
            }

            if (data?.sendMessage) {
                const cleanedMsg: Message = {
                    id: data.sendMessage.id,
                    sender: data.sendMessage.sender ? { id: data.sendMessage.sender.id, } : null,
                    receiver: data.sendMessage.receiver ? { id: data.sendMessage.receiver.id, } : null,
                    content: data.sendMessage.content,
                    createdAt: data.sendMessage.createdAt,
                };
                socketRef.current?.emit("message", cleanedMsg);
                setMessages((prev) => [...prev, cleanedMsg]);
                setNewMessage("");
                setTimeout(scrollToBottom, 100);
            } else {
                console.error("No data returned from sendMessage mutation");
                alert("Failed to send message: No data returned");
            }
        } catch (error) {
            console.error("Error sending message:", error);
            alert("Failed to send message. Please try again.");
        }
    }, [newMessage, selectedUser, sendMessage, scrollToBottom]);
    // Format timestamp for display
    const formatTime = useCallback((timestamp: string) => {
        try {
            const date = new Date(timestamp);
            if (isNaN(date.getTime())) return "Invalid time";

            return date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        } catch (error) {
            console.error('Error formatting timestamp:', error);
            return "Invalid time";
        }
    }, []);

    // Get last message preview
    const getLastMessagePreview = useCallback((messages: Message[]) => {
        if (!Array.isArray(messages) || messages.length === 0) return "No messages yet";
        const lastMessage = messages[messages.length - 1];
        if (!lastMessage || !lastMessage.content) return "No messages yet";

        return lastMessage.content.length > 30
            ? lastMessage.content.substring(0, 30) + "..."
            : lastMessage.content;
    }, []);

    if (profileLoading) return <div className="p-6 text-center">Loading profile...</div>;
    if (profileError) return <div className="p-6 text-center text-red-500">Error loading profile: {profileError.message}</div>;

    return (
        <div className="w-full">
            <div className="flex gap-4 h-[500px]">
                {/* Conversations List */}
                <div className="w-1/3 border rounded-lg p-2 overflow-y-auto">
                    <h2 className="font-semibold mb-3">Matched Users</h2>
                    {profileData?.getProfile?.matches && profileData.getProfile.matches.length > 0 ? (
                        profileData.getProfile.matches.map((matchedUser) => (
                            <div
                                key={matchedUser.id}
                                onClick={() => {
                                    setSelectedUser(matchedUser);
                                    fetchMessages(matchedUser.userId);
                                }}
                                className={`p-3 rounded-lg cursor-pointer mb-2 transition-colors ${selectedUser?.id === matchedUser.id
                                    ? "bg-blue-100 border-blue-300"
                                    : "bg-gray-50 hover:bg-gray-100"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    {/* Profile Image */}
                                    <div className="flex-shrink-0">
                                        {matchedUser.images && matchedUser.images.length > 0 ? (
                                            <img
                                                src={matchedUser.images[0]}
                                                alt={matchedUser.name || "User"}
                                                className="size-10 rounded-full object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
                                                }}
                                            />
                                        ) : (
                                            <div className="size-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                <span className="text-gray-600 text-sm font-medium">
                                                    {(matchedUser.name || "U").charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* User Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-sm text-gray-900">
                                            {matchedUser.name || "Unknown User"}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {matchedUser.work || "No work info"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-gray-500 mt-8">
                            No matched users yet
                        </div>
                    )}
                </div>

                {/* Chat Messages */}
                <div className="w-2/3 border rounded-lg p-4 flex flex-col">
                    {selectedUser ? (
                        <>
                            <div className="border-b pb-2 mb-4">
                                <div className="flex items-center gap-3">
                                    {/* Profile Image */}
                                    <div className="flex-shrink-0">
                                        {selectedUser.images && selectedUser.images.length > 0 ? (
                                            <img
                                                src={selectedUser.images[0]}
                                                alt={selectedUser.name || "User"}
                                                className="size-10 rounded-full object-cover"
                                                onError={(e) => {
                                                    // Fallback to default avatar if image fails to load
                                                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
                                                }}
                                            />
                                        ) : (
                                            <div className="size-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                <span className="text-gray-600 text-sm font-medium">
                                                    {(selectedUser.name || "U").charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* User Info */}
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">
                                            {selectedUser.name || "Unknown User"}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {selectedUser.profession || selectedUser.work || "No work info"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto mb-4 space-y-2">
                                {messages.length === 0 ? (
                                    <div className="text-center text-gray-500 mt-8">
                                        Start the conversation!
                                    </div>
                                ) : (
                                    messages.map((msg: Message, i: number) => {
                                        if (!msg || !msg.sender || !msg.receiver) return null;

                                        return (
                                            <div
                                                key={i}
                                                className={`p-3 rounded-lg max-w-[80%] ${msg.sender?.id === currentUserId
                                                    ? "bg-blue-500 text-white ml-auto"
                                                    : "bg-gray-200 text-gray-800 mr-auto"
                                                    }`}
                                            >
                                                <div className="text-sm">{msg.content || "No content"}</div>
                                                <div className={`text-xs mt-1 ${msg.sender?.id === currentUserId ? "text-blue-100" : "text-gray-500"
                                                    }`}>
                                                    {msg.createdAt ? formatTime(msg.createdAt) : "No timestamp"}
                                                </div>
                                            </div>
                                        );
                                    }).filter(Boolean)
                                )}
                                {/* Invisible div for auto-scrolling */}
                                <div ref={messagesEndRef} />
                            </div>

                            <div className="flex gap-2">
                                <input
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                                >
                                    Send
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center text-gray-500 mt-8">
                            Select a conversation to start chatting
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
