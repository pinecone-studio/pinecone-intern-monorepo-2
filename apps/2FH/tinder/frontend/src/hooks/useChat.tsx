// useChat.ts
import { useState, useRef, useCallback, useEffect } from 'react';
import { useGetProfileQuery, useSendMessageMutation, useGetMessagesBetweenUsersQuery } from '@/generated';
import { io, Socket } from 'socket.io-client';
import { MatchedUser, Message } from '@/types/chat-types';

export const useChat = (currentUserId: string) => {
    const [selectedUser, setSelectedUser] = useState<MatchedUser | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [socketConnected, setSocketConnected] = useState(false);

    const socketRef = useRef<Socket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const { data: profileData, loading: profileLoading, error: profileError } = useGetProfileQuery({
        variables: { userId: currentUserId },
        skip: !currentUserId
    });

    const [sendMessage] = useSendMessageMutation();

    const { data: messagesData, loading: messagesLoading, refetch: refetchMessages } = useGetMessagesBetweenUsersQuery({
        variables: { userId1: currentUserId, userId2: selectedUser?.userId || '' },
        skip: !selectedUser
    });

    // Scroll to bottom
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    // Socket.IO
    useEffect(() => {
        if (!socketRef.current) {
            socketRef.current = io('http://localhost:4300', {
                transports: ['websocket', 'polling'],
                timeout: 20000,
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000
            });

            socketRef.current.on('connect', () => {
                setSocketConnected(true);
                socketRef.current?.emit('register', currentUserId);
            });

            socketRef.current.on('disconnect', () => setSocketConnected(false));
            socketRef.current.on('connect_error', () => setSocketConnected(false));
            socketRef.current.on('reconnect', () => {
                setSocketConnected(true);
                socketRef.current?.emit('register', currentUserId);
            });

            socketRef.current.on('newMessage', (msg: Message) => {
                setMessages(prev => {
                    const combined = [...prev, msg];
                    return combined.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
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

    // Update messages from query
    useEffect(() => {
        if (messagesData?.getMessagesBetweenUsers) {
            const sorted = [...messagesData.getMessagesBetweenUsers].sort(
                (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
            setMessages(sorted);
        }
    }, [messagesData]);

    // Load first matched user
    useEffect(() => {
        if (profileData?.getProfile?.matches && profileData.getProfile.matches.length > 0) {
            if (!selectedUser) {
                const firstUser = profileData.getProfile.matches[0] as unknown as MatchedUser;
                setSelectedUser(firstUser);
            }
        }
    }, [profileData, selectedUser]);

    // Fetch messages when selectedUser changes
    useEffect(() => {
        if (selectedUser && refetchMessages) {
            refetchMessages({ userId1: currentUserId, userId2: selectedUser.userId });
        }
    }, [selectedUser, refetchMessages, currentUserId]);

    // Auto-refresh messages every 5 секунд
    useEffect(() => {
        if (!selectedUser) return;

        const interval = setInterval(() => {
            if (refetchMessages && selectedUser) {
                refetchMessages({ userId1: currentUserId, userId2: selectedUser.userId });
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [selectedUser, refetchMessages, currentUserId]);

    const handleSendMessage = useCallback(async () => {
        if (!newMessage.trim() || !selectedUser) return;

        const receiverId = selectedUser.userId;

        try {
            const { data, errors } = await sendMessage({
                variables: { input: { senderId: currentUserId, receiverId, content: newMessage } },
            });
            if (errors) return;
            if (data?.sendMessage) {
                const cleanedMsg: Message = {
                    id: data.sendMessage.id,
                    sender: data.sendMessage.sender ? { id: data.sendMessage.sender.id, email: data.sendMessage.sender.email } : null,
                    receiver: data.sendMessage.receiver ? { id: data.sendMessage.receiver.id, email: data.sendMessage.receiver.email } : null,
                    content: data.sendMessage.content,
                    createdAt: data.sendMessage.createdAt,
                };
                setMessages(prev => [...prev, cleanedMsg].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));
                setNewMessage('');
                setTimeout(scrollToBottom, 100);

                if (socketRef.current) socketRef.current.emit('message', cleanedMsg);
            }
        } catch (error) { }
    }, [newMessage, selectedUser, sendMessage, scrollToBottom, currentUserId]);
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
        fetchMessages: refetchMessages
    };
};
