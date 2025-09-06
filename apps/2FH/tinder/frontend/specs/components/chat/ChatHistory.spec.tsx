import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ChatHistory from "@/components/chat/ChatHistory";

// Mock dependencies
const mockSetSelectedUser = jest.fn();
const mockSetNewMessage = jest.fn();
const mockHandleSendMessage = jest.fn();
const mockFetchMessages = jest.fn();

// Mock the hooks
jest.mock("@/hooks/useChat", () => ({
    useChat: () => ({
        selectedUser: null,
        setSelectedUser: mockSetSelectedUser,
        messages: [],
        newMessage: "",
        setNewMessage: mockSetNewMessage,
        profileData: {
            getProfile: {
                matches: [
                    {
                        id: "1",
                        userId: "user1",
                        name: "John Doe",
                        bio: "Test bio",
                        images: ["test-image.jpg"],
                        dateOfBirth: "1990-01-01"
                    }
                ]
            }
        },
        profileLoading: false,
        profileError: null,
        messagesLoading: false,
        messagesEndRef: { current: null },
        handleSendMessage: mockHandleSendMessage,
        fetchMessages: mockFetchMessages
    })
}));

jest.mock("@/hooks/useTinderSwipe", () => ({
    useTinderSwipe: () => ({
        profiles: [],
        handleSwipe: jest.fn()
    })
}));

jest.mock("@/contexts/UserContext", () => ({
    useUser: () => ({
        user: { id: "current-user-id" }
    })
}));

// Mock child components
jest.mock("@/components/chat/ConversationList", () => {
    return function MockConversationList({ matches, selectedUser, onUserSelect }: any) {
        return (
            <div data-testid="conversation-list">
                {matches.map((match: any) => (
                    <div
                        key={match.userId}
                        onClick={() => onUserSelect(match)}
                        data-testid={`conversation-item-${match.userId}`}
                    >
                        {match.name}
                    </div>
                ))}
            </div>
        );
    };
});

jest.mock("@/components/chat/MatchedUser", () => {
    return function MockMatchedUser({ onUserSelect, currentUserId }: any) {
        return (
            <div data-testid="matched-user">
                <div
                    onClick={() => onUserSelect({ userId: "test-user", name: "Test User" })}
                    data-testid="match-item"
                >
                    Test Match
                </div>
            </div>
        );
    };
});

jest.mock("@/components/chat/Header", () => {
    return function MockHeader({ currentUserProfile, profileLoading, onProfileClick }: any) {
        return (
            <div data-testid="header">
                <button onClick={onProfileClick} data-testid="profile-button">
                    Profile
                </button>
            </div>
        );
    };
});

jest.mock("@/components/chat/ProfileView", () => {
    return function MockProfileView({ selectedUser }: any) {
        return (
            <div data-testid="profile-view">
                {selectedUser ? selectedUser.name : "No user selected"}
            </div>
        );
    };
});

jest.mock("@/components/chat/ChatArea", () => {
    return function MockChatArea({ selectedUser, messages, onUserClick }: any) {
        return (
            <div data-testid="chat-area">
                {selectedUser ? `Chat with ${selectedUser.name}` : "No chat selected"}
                {messages.map((message: any, index: number) => (
                    <div key={index} data-testid={`message-${index}`}>
                        {message.text}
                    </div>
                ))}
            </div>
        );
    };
});

jest.mock("@/components/chat/ProfilePreviewModal", () => {
    return function MockProfilePreviewModal({ onClose, profile, onSave }: any) {
        return (
            <div data-testid="profile-preview-modal">
                <button onClick={onClose} data-testid="close-modal">Close</button>
                <button onClick={() => onSave({})} data-testid="save-profile">Save</button>
            </div>
        );
    };
});

jest.mock("@/components/chat/SwipeComponent", () => {
    return function MockSwipeComponent({ onClose, matches, onMatchClick, onSwipe }: any) {
        return (
            <div data-testid="swipe-component">
                <button onClick={onClose} data-testid="close-swipe">Close</button>
                {matches.map((match: any) => (
                    <div
                        key={match.userId}
                        onClick={() => onMatchClick(match)}
                        data-testid={`swipe-match-${match.userId}`}
                    >
                        {match.name}
                    </div>
                ))}
                <button onClick={() => onSwipe("right", {})} data-testid="swipe-right">Swipe Right</button>
            </div>
        );
    };
});

describe("ChatHistory", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders without crashing", () => {
        render(<ChatHistory />);
        expect(screen.getByTestId("header")).toBeInTheDocument();
    });

    it("shows loading state when no user", () => {
        // Mock useUser to return no user
        jest.doMock("@/contexts/UserContext", () => ({
            useUser: () => ({ user: null })
        }));

        render(<ChatHistory />);
        expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("renders matches tab by default", () => {
        render(<ChatHistory />);
        expect(screen.getByTestId("matched-user")).toBeInTheDocument();
    });

    it("switches to messages tab when clicked", () => {
        render(<ChatHistory />);

        const messagesTab = screen.getByText("Messages");
        fireEvent.click(messagesTab);

        expect(screen.getByTestId("conversation-list")).toBeInTheDocument();
    });

    it("handles user selection from matches", () => {
        render(<ChatHistory />);

        const matchItem = screen.getByTestId("match-item");
        fireEvent.click(matchItem);

        expect(mockSetSelectedUser).toHaveBeenCalledWith({ userId: "test-user", name: "Test User" });
    });

    it("handles user selection from conversations", () => {
        render(<ChatHistory />);

        // Switch to messages tab first
        const messagesTab = screen.getByText("Messages");
        fireEvent.click(messagesTab);

        const conversationItem = screen.getByTestId("conversation-item-user1");
        fireEvent.click(conversationItem);

        expect(mockSetSelectedUser).toHaveBeenCalled();
    });

    it("shows chat area when user is selected", () => {
        // Mock selectedUser to be truthy
        jest.doMock("@/hooks/useChat", () => ({
            useChat: () => ({
                selectedUser: { userId: "test-user", name: "Test User" },
                setSelectedUser: mockSetSelectedUser,
                messages: [],
                newMessage: "",
                setNewMessage: mockSetNewMessage,
                profileData: { getProfile: { matches: [] } },
                profileLoading: false,
                profileError: null,
                messagesLoading: false,
                messagesEndRef: { current: null },
                handleSendMessage: mockHandleSendMessage,
                fetchMessages: mockFetchMessages
            })
        }));

        render(<ChatHistory />);
        expect(screen.getByTestId("chat-area")).toBeInTheDocument();
    });

    it("handles profile click to switch view modes", () => {
        render(<ChatHistory />);

        const profileButton = screen.getByTestId("profile-button");
        fireEvent.click(profileButton);

        // Should switch to profile view mode
        expect(screen.getByTestId("profile-preview-modal")).toBeInTheDocument();
    });

    it("handles profile save", () => {
        render(<ChatHistory />);

        // Click profile button to open modal
        const profileButton = screen.getByTestId("profile-button");
        fireEvent.click(profileButton);

        const saveButton = screen.getByTestId("save-profile");
        fireEvent.click(saveButton);

        // Should close modal and switch back to chat
        expect(screen.getByTestId("chat-area")).toBeInTheDocument();
    });

    it("handles swipe component interactions", () => {
        // Mock profiles for swipe component
        jest.doMock("@/hooks/useTinderSwipe", () => ({
            useTinderSwipe: () => ({
                profiles: [
                    {
                        id: "1",
                        userId: "swipe-user",
                        name: "Swipe User",
                        bio: "Test bio",
                        images: ["test.jpg"],
                        dateOfBirth: "1990-01-01"
                    }
                ],
                handleSwipe: jest.fn()
            })
        }));

        render(<ChatHistory />);

        // Click profile button twice to get to swipe mode
        const profileButton = screen.getByTestId("profile-button");
        fireEvent.click(profileButton); // First click goes to profile
        fireEvent.click(profileButton); // Second click goes to swipe

        expect(screen.getByTestId("swipe-component")).toBeInTheDocument();
    });

    it("handles match click in swipe mode", () => {
        // Mock profiles and selectedUser
        jest.doMock("@/hooks/useTinderSwipe", () => ({
            useTinderSwipe: () => ({
                profiles: [
                    {
                        id: "1",
                        userId: "swipe-user",
                        name: "Swipe User",
                        bio: "Test bio",
                        images: ["test.jpg"],
                        dateOfBirth: "1990-01-01"
                    }
                ],
                handleSwipe: jest.fn()
            })
        }));

        jest.doMock("@/hooks/useChat", () => ({
            useChat: () => ({
                selectedUser: null,
                setSelectedUser: mockSetSelectedUser,
                messages: [],
                newMessage: "",
                setNewMessage: mockSetNewMessage,
                profileData: { getProfile: { matches: [] } },
                profileLoading: false,
                profileError: null,
                messagesLoading: false,
                messagesEndRef: { current: null },
                handleSendMessage: mockHandleSendMessage,
                fetchMessages: mockFetchMessages
            })
        }));

        render(<ChatHistory />);

        // Navigate to swipe mode
        const profileButton = screen.getByTestId("profile-button");
        fireEvent.click(profileButton);
        fireEvent.click(profileButton);

        const matchItem = screen.getByTestId("swipe-match-swipe-user");
        fireEvent.click(matchItem);

        expect(mockSetSelectedUser).toHaveBeenCalled();
    });

    it("handles swipe actions", () => {
        const mockHandleSwipe = jest.fn();

        jest.doMock("@/hooks/useTinderSwipe", () => ({
            useTinderSwipe: () => ({
                profiles: [],
                handleSwipe: mockHandleSwipe
            })
        }));

        render(<ChatHistory />);

        // Navigate to swipe mode
        const profileButton = screen.getByTestId("profile-button");
        fireEvent.click(profileButton);
        fireEvent.click(profileButton);

        const swipeRightButton = screen.getByTestId("swipe-right");
        fireEvent.click(swipeRightButton);

        expect(mockHandleSwipe).toHaveBeenCalledWith("right", {});
    });

    it("shows loading state when profile is loading", () => {
        jest.doMock("@/hooks/useChat", () => ({
            useChat: () => ({
                selectedUser: null,
                setSelectedUser: mockSetSelectedUser,
                messages: [],
                newMessage: "",
                setNewMessage: mockSetNewMessage,
                profileData: null,
                profileLoading: true,
                profileError: null,
                messagesLoading: false,
                messagesEndRef: { current: null },
                handleSendMessage: mockHandleSendMessage,
                fetchMessages: mockFetchMessages
            })
        }));

        render(<ChatHistory />);
        expect(screen.getByText("Loading profile...")).toBeInTheDocument();
    });

    it("shows error state when profile has error", () => {
        jest.doMock("@/hooks/useChat", () => ({
            useChat: () => ({
                selectedUser: null,
                setSelectedUser: mockSetSelectedUser,
                messages: [],
                newMessage: "",
                setNewMessage: mockSetNewMessage,
                profileData: null,
                profileLoading: false,
                profileError: { message: "Test error" },
                messagesLoading: false,
                messagesEndRef: { current: null },
                handleSendMessage: mockHandleSendMessage,
                fetchMessages: mockFetchMessages
            })
        }));

        render(<ChatHistory />);
        expect(screen.getByText("Error loading profile: Test error")).toBeInTheDocument();
    });

    it("renders with empty matches list", () => {
        jest.doMock("@/hooks/useChat", () => ({
            useChat: () => ({
                selectedUser: null,
                setSelectedUser: mockSetSelectedUser,
                messages: [],
                newMessage: "",
                setNewMessage: mockSetNewMessage,
                profileData: { getProfile: { matches: [] } },
                profileLoading: false,
                profileError: null,
                messagesLoading: false,
                messagesEndRef: { current: null },
                handleSendMessage: mockHandleSendMessage,
                fetchMessages: mockFetchMessages
            })
        }));

        render(<ChatHistory />);

        const messagesTab = screen.getByText("Messages");
        fireEvent.click(messagesTab);

        expect(screen.getByText("No conversations yet")).toBeInTheDocument();
    });

    it("handles close actions", () => {
        render(<ChatHistory />);

        // Open profile modal
        const profileButton = screen.getByTestId("profile-button");
        fireEvent.click(profileButton);

        const closeButton = screen.getByTestId("close-modal");
        fireEvent.click(closeButton);

        // Should return to chat view
        expect(screen.getByTestId("chat-area")).toBeInTheDocument();
    });

    it("handles swipe close", () => {
        // Mock profiles for swipe
        jest.doMock("@/hooks/useTinderSwipe", () => ({
            useTinderSwipe: () => ({
                profiles: [
                    {
                        id: "1",
                        userId: "swipe-user",
                        name: "Swipe User",
                        bio: "Test bio",
                        images: ["test.jpg"],
                        dateOfBirth: "1990-01-01"
                    }
                ],
                handleSwipe: jest.fn()
            })
        }));

        render(<ChatHistory />);

        // Navigate to swipe mode
        const profileButton = screen.getByTestId("profile-button");
        fireEvent.click(profileButton);
        fireEvent.click(profileButton);

        const closeSwipeButton = screen.getByTestId("close-swipe");
        fireEvent.click(closeSwipeButton);

        // Should return to chat view
        expect(screen.getByTestId("chat-area")).toBeInTheDocument();
    });

    it("tests all ternary operator branches in ChatHistory", () => {
        // Test the actual ChatHistory component with different states to hit all branches
        const { rerender } = render(<ChatHistory />);

        // Test matches tab (default)
        expect(screen.getByTestId("matched-user")).toBeInTheDocument();

        // Test messages tab
        const messagesTab = screen.getByText("Messages");
        fireEvent.click(messagesTab);
        expect(screen.getByTestId("conversation-list")).toBeInTheDocument();

        // Test profile view mode
        const profileButton = screen.getByTestId("profile-button");
        fireEvent.click(profileButton);
        expect(screen.getByTestId("profile-preview-modal")).toBeInTheDocument();

        // Test swipe view mode
        fireEvent.click(profileButton);
        expect(screen.getByTestId("swipe-component")).toBeInTheDocument();

        // Test chat view mode (default when user selected)
        fireEvent.click(profileButton);
        expect(screen.getByTestId("chat-area")).toBeInTheDocument();
    });

    it("handles complex user interactions", () => {
        render(<ChatHistory />);

        // Start with matches tab, select a user
        const matchItem = screen.getByTestId("match-item");
        fireEvent.click(matchItem);

        // Switch to messages tab
        const messagesTab = screen.getByText("Messages");
        fireEvent.click(messagesTab);

        // Select a conversation
        const conversationItem = screen.getByTestId("conversation-item-user1");
        fireEvent.click(conversationItem);

        // Navigate through different view modes
        const profileButton = screen.getByTestId("profile-button");
        fireEvent.click(profileButton); // Profile mode
        fireEvent.click(profileButton); // Swipe mode
        fireEvent.click(profileButton); // Back to chat mode

        expect(screen.getByTestId("chat-area")).toBeInTheDocument();
    });

    it("maintains state consistency across tab switches", () => {
        render(<ChatHistory />);

        // Select a user in matches tab
        const matchItem = screen.getByTestId("match-item");
        fireEvent.click(matchItem);

        // Switch to messages tab
        const messagesTab = screen.getByText("Messages");
        fireEvent.click(messagesTab);

        // Switch back to matches tab
        const matchesTab = screen.getByText("Matches");
        fireEvent.click(matchesTab);

        // User selection should be maintained
        expect(screen.getByTestId("matched-user")).toBeInTheDocument();
    });
});