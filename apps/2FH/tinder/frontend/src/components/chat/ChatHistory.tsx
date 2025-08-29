"use client";

import React from 'react';
import { SendIcon } from 'lucide-react';
import { Message } from '../../types/types';
import { formatTime, calculateAge } from '../../utils/utils';
import { useChat } from '../../hooks/useChat';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { ConversationsList } from './ConversationsList';

export default function ChatHistory() {
  const currentUserId = '68a564a552cf45602b4c2d60';

  const [selectedUser, setSelectedUser] = useLocalStorage('tinder-selected-user', null);

  const {
    messages,
    newMessage,
    setNewMessage,
    profileData,
    profileLoading,
    profileError,
    messagesLoading,
    messagesEndRef,
    handleSendMessage,
    fetchMessages
  } = useChat(currentUserId);

  const handleUserSelect = (user: any) => {
    setSelectedUser(user);
    fetchMessages(user.userId);
  };

  if (profileLoading) return <div className="p-6 text-center">Loading profile...</div>;
  if (profileError) return <div className="p-6 text-center text-red-500">Error loading profile: {profileError.message}</div>;

  return (
    <div className="w-full h-[930px]">
      <div className="flex h-full p-4">
        {/* Conversations List */}
        <ConversationsList
          matches={profileData?.getProfile?.matches || []}
          selectedUser={selectedUser}
          onUserSelect={handleUserSelect}
        />

        {/* Chat Messages */}
        <div className="w-4/5 border p-4 flex flex-col h-full">
          {selectedUser ? (
            <>
              <div className="border-b pb-2 mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {selectedUser.images && selectedUser.images.length > 0 ? (
                      <img
                        src={selectedUser.images[0]}
                        alt={selectedUser.name || "User"}
                        className="size-10 rounded-full object-cover"
                        onError={(e) => {
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

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {selectedUser.name || "Unknown User"}
                      </h3>
                      {selectedUser.dateOfBirth && (
                        <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                          {calculateAge(selectedUser.dateOfBirth)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 font-medium">
                      {selectedUser.profession || selectedUser.work || "No work info"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto mb-4 space-y-2 min-h-0">
                {messagesLoading ? (
                  <div className="text-center text-gray-500 mt-8">
                    Loading messages...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-8">
                    Start the conversation!
                  </div>
                ) : (
                  messages.map((msg: Message, i: number) => {
                    if (!msg || !msg.sender || !msg.receiver) return null;
                    return (
                      <div
                        key={i}
                        className={`p-3 rounded-lg max-w-[40%] ${msg.sender?.id === currentUserId
                          ? "bg-[#E11D48E5] text-white ml-auto"
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
                <div ref={messagesEndRef} />
              </div>

              <div className="flex gap-2 mt-auto">
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  onBlur={(e) => e.target.style.caretColor = 'transparent'}
                  onFocus={(e) => e.target.style.caretColor = 'auto'}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ caretColor: 'transparent' }}
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-[#E11D48E5] flex items-center gap-2 text-white rounded-lg hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  <SendIcon className="w-4 h-4" />
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
