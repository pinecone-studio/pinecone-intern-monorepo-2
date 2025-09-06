"use client";

import React from "react";
import { MatchedUser } from "@/types/chat-types";

interface ChatHeaderProps {
    selectedUser: MatchedUser;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ selectedUser }) => {
    return (
        <div className="border-b px-4 py-3 flex items-center gap-3 flex-shrink-0">
            <img
                src={selectedUser.images?.[0] || "https://via.placeholder.com/40"}
                alt={selectedUser.name}
                className="w-10 h-10 rounded-full object-cover"
            />
            <div>
                <h3 className="font-semibold text-lg">{selectedUser.name}</h3>
            </div>
        </div>
    );
};

export default ChatHeader;