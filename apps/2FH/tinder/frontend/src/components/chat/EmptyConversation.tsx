"use client";

import React from "react";
import { MatchedUser } from "@/types/chat-types";

interface EmptyConversationProps {
    selectedUser: MatchedUser;
}

const EmptyConversation: React.FC<EmptyConversationProps> = ({ selectedUser }) => {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <img
                src={selectedUser.images?.[0]}
                alt={selectedUser.name}
                className="w-50 h-50 rounded-full object-cover"
            />
            <p className="text-gray-500 mt-5 text-lg">
                Start the conversation!
            </p>
        </div>
    );
};

export default EmptyConversation;