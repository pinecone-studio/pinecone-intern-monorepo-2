"use client";

import React from "react";
import { formatTime } from "@/utils/chat-utils";
import { Message } from "@/types/chat-types";

interface MessageItemProps {
    message: Message;
    isCurrentUser: boolean;
    selectedUserName: string;
    onUserClick?: (userId: string) => void;
}

const MessageItem: React.FC<MessageItemProps> = ({
    message,
    isCurrentUser,
    selectedUserName,
    onUserClick
}) => {
    return (
        <div
            className={`p-3 rounded-lg max-w-[20%] break-words whitespace-pre-wrap ${isCurrentUser
                ? "bg-pink-600 text-white ml-auto"
                : "bg-gray-200 text-gray-800 mr-auto"
                }`}
        >
            <div className="text-sm">{message.content}</div>
            <div className={`text-xs mt-1 flex justify-between items-center ${isCurrentUser
                ? "text-pink-100"
                : "text-gray-500"
                }`}>
                <span>{message.createdAt ? formatTime(message.createdAt) : "No timestamp"}</span>
                <span
                    className={`text-xs opacity-75 ${!isCurrentUser && onUserClick ? 'cursor-pointer hover:underline hover:bg-gray-100 px-1 rounded' : ''}`}
                    onClick={!isCurrentUser && onUserClick ? (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onUserClick(message.sender?.id || '');
                    } : undefined}
                >
                    {isCurrentUser ? "You" : selectedUserName || "Unknown"}
                </span>
            </div>
        </div>
    );
};

export default MessageItem;