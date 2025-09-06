import React from "react";
import { MatchedUser } from "@/types/chat-types";
import { calculateAge } from "@/utils/chat-utils";

interface ConversationsListProps {
    matches: MatchedUser[];
    selectedUser: MatchedUser | null;
    onUserSelect: (_user: MatchedUser) => void;
    onUserClick?: (userId: string) => void;
}

interface ConversationItemProps {
    matchedUser: MatchedUser;
    isSelected: boolean;
    onUserSelect: (_user: MatchedUser) => void;
    onUserClick?: (userId: string) => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
    matchedUser,
    isSelected,
    onUserSelect,
    onUserClick,
}) => {
    return (
        <div
            key={matchedUser.userId}
            onClick={() => {
                onUserSelect(matchedUser);
                if (onUserClick) {
                    onUserClick(matchedUser.userId);
                }
            }}
            className={`p-4 cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-colors ${isSelected ? "bg-gray-50" : "bg-white"
                }`}
        >
            <div className="flex items-center gap-4">
                <div className="relative">
                    <img
                        src={matchedUser.images?.[0] || "https://via.placeholder.com/50"}
                        className="w-12 h-12 rounded-full object-cover"
                    />
                    {/* Online indicator */}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900 text-sm">
                                {matchedUser.name || "Unknown"}
                            </h3>
                            {/* Verified badge */}
                            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">✓</span>
                            </div>
                        </div>
                        {matchedUser.dateOfBirth && (
                            <span className="text-xs text-gray-500">
                                {calculateAge(matchedUser.dateOfBirth)}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm text-gray-600 truncate">
                            {matchedUser.work || "No work info"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const ConversationsList: React.FC<ConversationsListProps> = ({
    matches,
    selectedUser,
    onUserSelect,
    onUserClick,
}) => {
    return (
        <div className="w-full overflow-y-auto h-screen bg-white scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {matches && matches.length > 0 ? (
                matches.map((matchedUser) => (
                    <ConversationItem
                        key={matchedUser.userId}
                        matchedUser={matchedUser}
                        isSelected={selectedUser?.userId === matchedUser.userId}
                        onUserSelect={onUserSelect}
                        onUserClick={onUserClick}
                    />
                ))
            ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                    <div className="text-4xl mb-2">💬</div>
                    <p className="text-sm">No conversations yet</p>
                    <p className="text-xs">Start chatting with your matches!</p>
                </div>
            )}
        </div>
    );
};