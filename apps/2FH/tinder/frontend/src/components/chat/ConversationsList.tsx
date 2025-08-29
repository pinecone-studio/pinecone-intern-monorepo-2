import React from 'react';
import { MatchedUser } from '../../types/types';
import { calculateAge } from '../../utils/utils';

interface ConversationsListProps {
    matches: MatchedUser[];
    selectedUser: MatchedUser | null;
    onUserSelect: (user: MatchedUser) => void;
}

export const ConversationsList: React.FC<ConversationsListProps> = ({
    matches,
    selectedUser,
    onUserSelect
}) => {
    return (
        <div className="w-1/5 border-t overflow-y-auto">
            {matches && matches.length > 0 ? (
                matches.map((matchedUser) => (
                    <div
                        key={matchedUser.id}
                        onClick={() => onUserSelect(matchedUser)}
                        className={`p-3 cursor-pointer border-b mb-2 transition-colors ${selectedUser?.id === matchedUser.id
                            ? "bg-gray-100"
                            : "text-gray-700 hover:bg-gray-100"
                            }`}
                    >
                        <div className="flex items-center gap-3">
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

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <div className="font-medium text-sm text-gray-900">
                                        {matchedUser.name || "Unknown User"}
                                    </div>
                                    {matchedUser.dateOfBirth && (
                                        <span className="text-xs text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded-full">
                                            {calculateAge(matchedUser.dateOfBirth)}
                                        </span>
                                    )}
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
    );
}; 