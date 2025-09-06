"use client";

import React from "react";
import { SendIcon } from "lucide-react";

interface MessageInputProps {
    newMessage: string;
    setNewMessage: (message: string) => void;
    handleSendMessage: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
    newMessage,
    setNewMessage,
    handleSendMessage
}) => {
    return (
        <div className="flex gap-2 p-4 flex-shrink-0">
            <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-pink-600 text-white rounded-lg flex items-center gap-2 hover:bg-pink-700"
            >
                <SendIcon className="w-4 h-4" /> Send
            </button>
        </div>
    );
};

export default MessageInput;