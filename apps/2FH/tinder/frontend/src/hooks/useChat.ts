import { useState, useRef, useCallback, useEffect } from 'react';
import { useGetProfileQuery, useSendMessageMutation, useGetMessagesBetweenUsersLazyQuery } from '@/generated';
import { io, Socket } from 'socket.io-client';
import { MatchedUser, Message } from '../types/types';

export const useChat = (currentUserId: string) => {
    const [selectedUser, setSelectedUser] = useState<MatchedUser | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [socketConnected, setSocketConnected] = useState(false);

    const socketRef = useRef<Socket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Get matched users from getProfile
    const { data: profileData, loading: profileLoading, error: profileError } = useGetProfileQuery({
        variables: { userId: currentUserId },
        skip: !currentUserId
    });

    const [sendMessage] = useSendMessageMutation();
    const [getMessagesBetweenUsers, { data: messagesData, loading: messagesLoading }] = useGetMessagesBetweenUsersLazyQuery();

    // Auto-scroll to bottom of messages
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    // Scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    // Socket.IO connection
    useEffect(() => {
        if (!socketRef.current) {
            socketRef.current = io("http://localhost:4300", {
                transports: ["websocket", "polling"],
                timeout: 20000,
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000
            });

            socketRef.current.on("connect", () => {
                setSocketConnected(true);
                socketRef.current?.emit("register", currentUserId);
            });

            socketRef.current.on("connect_error", () => {
                setSocketConnected(false);
            });

            socketRef.current.on("disconnect", () => {
                setSocketConnected(false);
            });

            socketRef.current.on("reconnect", () => {
                setSocketConnected(true);
                socketRef.current?.emit("register", currentUserId);
            });

            socketRef.current.on("newMessage", (msg: any) => {
                setMessages(prev => {
                    const newMessages = [...prev];
                    const messageIndex = newMessages.findIndex(m => m.id === msg.id);

                    if (messageIndex !== -1) {
                        newMessages[messageIndex] = { ...newMessages[messageIndex], ...msg };
                    } else {
                        newMessages.push(msg);
                    }

                    return newMessages;
                });

                setTimeout(scrollToBottom, 100);
            });
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [currentUserId, scrollToBottom]);

    // Fetch messages between current user and selected user
    const fetchMessages = useCallback(async (otherUserId: string) => {
        if (!otherUserId) return;

        try {
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
            if (!selectedUser) {
                const firstUser = profileData.getProfile.matches[0];
                setSelectedUser(firstUser);
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

    // Fetch messages when selectedUser changes
    useEffect(() => {
        if (selectedUser) {
            fetchMessages(selectedUser.userId);
        }
    }, [selectedUser, fetchMessages]);

    // Auto-refresh messages every 5 seconds when a user is selected
    useEffect(() => {
        if (!selectedUser) return;

        const interval = setInterval(() => {
            fetchMessages(selectedUser.userId);
        }, 5000);

        return () => clearInterval(interval);
    }, [selectedUser, fetchMessages]);

    // Handle send message
    const handleSendMessage = useCallback(async () => {
        if (!newMessage.trim() || !selectedUser) {
            alert("Please enter a message and select a user!");
            return;
        }

        const receiverId = selectedUser.userId;

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

            if (errors) {
                alert("Failed to send message: " + errors.map((e) => e.message).join(", "));
                return;
            }

            if (data?.sendMessage) {
                const cleanedMsg: Message = {
                    id: data.sendMessage.id,
                    sender: data.sendMessage.sender ? {
                        id: data.sendMessage.sender.id,
                        email: data.sendMessage.sender.email
                    } : null,
                    receiver: data.sendMessage.receiver ? {
                        id: data.sendMessage.receiver.id,
                        email: data.sendMessage.receiver.email
                    } : null,
                    content: data.sendMessage.content,
                    createdAt: data.sendMessage.createdAt,
                };

                setMessages((prev) => [...prev, cleanedMsg]);
                setNewMessage("");
                setTimeout(scrollToBottom, 100);

                if (socketRef.current) {
                    socketRef.current.emit("message", cleanedMsg);
                }

                setTimeout(() => {
                    fetchMessages(selectedUser.userId);
                }, 1000);
            }
        } catch (error) {
            alert("Failed to send message. Please try again.");
        }
    }, [newMessage, selectedUser, sendMessage, scrollToBottom, fetchMessages, currentUserId]);

    return {
        selectedUser,
        setSelectedUser,
        messages,
        newMessage,
        setNewMessage,
        socketConnected,
        profileData,
        profileLoading,
        profileError,
        messagesLoading,
        messagesEndRef,
        handleSendMessage,
        fetchMessages
    };
}; 