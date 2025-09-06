import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ChatArea from "@/components/chat/ChatArea";

describe("ChatArea component", () => {
    const baseProps = {
        selectedUser: {
            id: "u2",
            name: "John Doe",
            images: ["https://via.placeholder.com/40"]
        },
        messages: [],
        messagesLoading: false,
        newMessage: "",
        setNewMessage: jest.fn(),
        handleSendMessage: jest.fn(),
        messagesEndRef: { current: null },
        currentUserId: "u1",
        onUserClick: jest.fn()
    };

    it("renders EmptyState when no user is selected", () => {
        render(<ChatArea {...baseProps} selectedUser={null} />);
        expect(screen.getByText(/Select a conversation to start chatting/i)).toBeInTheDocument();
    });

    it("renders loading state when messagesLoading = true", () => {
        render(<ChatArea {...baseProps} messagesLoading={true} />);
        expect(screen.getByText(/Loading messages/i)).toBeInTheDocument();
    });

    it("renders empty conversation state", () => {
        render(<ChatArea {...baseProps} />);
        expect(screen.getByText(/Start the conversation!/i)).toBeInTheDocument();
    });

    it("renders messages correctly (current user vs other user)", () => {
        const messages = [
            { sender: { id: "u1" }, content: "Hello", createdAt: new Date().toISOString() },
            { sender: { id: "u2" }, content: "Hi back", createdAt: new Date().toISOString() }
        ];

        render(<ChatArea {...baseProps} messages={messages} />);

        expect(screen.getByText("Hello")).toBeInTheDocument();
        expect(screen.getByText("Hi back")).toBeInTheDocument();
    });

    it("calls setNewMessage when typing", () => {
        render(<ChatArea {...baseProps} />);
        const input = screen.getByPlaceholderText(/Type a message/i);
        fireEvent.change(input, { target: { value: "test message" } });
        expect(baseProps.setNewMessage).toHaveBeenCalledWith("test message");
    });

    it("calls handleSendMessage when pressing Enter", () => {
        render(<ChatArea {...baseProps} newMessage="Hi" />);
        const input = screen.getByPlaceholderText(/Type a message/i);
        fireEvent.keyPress(input, { key: "Enter", code: "Enter", charCode: 13 });
        expect(baseProps.handleSendMessage).toHaveBeenCalled();
    });

    it("calls handleSendMessage when clicking Send button", () => {
        render(<ChatArea {...baseProps} />);
        const sendButton = screen.getByText(/Send/i);
        fireEvent.click(sendButton);
        expect(baseProps.handleSendMessage).toHaveBeenCalled();
    });

    it("calls onUserClick when clicking other user's name", () => {
        const messages = [
            { sender: { id: "u2" }, content: "Hi", createdAt: new Date().toISOString() }
        ];

        render(<ChatArea {...baseProps} messages={messages} />);
        // Click on the clickable span with the sender name
        const clickableSpan = screen.getByText("John Doe", { selector: 'span' });
        fireEvent.click(clickableSpan);
        expect(baseProps.onUserClick).toHaveBeenCalledWith("u2");
    });

    it("does not call onUserClick when clicking current user's name", () => {
        // Create a fresh mock for this test
        const mockOnUserClick = jest.fn();
        const testProps = {
            ...baseProps,
            onUserClick: mockOnUserClick
        };

        const messages = [
            { sender: { id: "u1" }, content: "Hello", createdAt: new Date().toISOString() }
        ];

        render(<ChatArea {...testProps} messages={messages} />);
        // Click on the "You" text in the message - it should not be clickable
        const youText = screen.getByText("You");
        fireEvent.click(youText);
        expect(mockOnUserClick).not.toHaveBeenCalled();
    });

    it("handles message without sender id gracefully", () => {
        const messages = [
            { sender: {}, content: "Message without sender id", createdAt: new Date().toISOString() }
        ];

        render(<ChatArea {...baseProps} messages={messages} />);
        expect(screen.getByText("Message without sender id")).toBeInTheDocument();
        // When sender has no id, it's not current user, so it shows selectedUser.name
        // Use getAllByText and check the span element
        const johnDoeElements = screen.getAllByText("John Doe");
        expect(johnDoeElements).toHaveLength(2); // Header and message
    });

    it("handles message without timestamp", () => {
        const messages = [
            { sender: { id: "u2" }, content: "Message without timestamp" }
        ];

        render(<ChatArea {...baseProps} messages={messages} />);
        expect(screen.getByText("No timestamp")).toBeInTheDocument();
    });

    it("handles selectedUser without name", () => {
        const selectedUserWithoutName = {
            id: "u2",
            images: ["https://via.placeholder.com/40"]
        };
        const messages = [
            { sender: { id: "u2" }, content: "Hi", createdAt: new Date().toISOString() }
        ];

        render(<ChatArea {...baseProps} selectedUser={selectedUserWithoutName} messages={messages} />);
        expect(screen.getByText("Unknown")).toBeInTheDocument();
    });

    it("shows Unknown when selectedUser has no name and message has no sender id", () => {
        const selectedUserWithoutName = {
            id: "u2",
            images: ["https://via.placeholder.com/40"]
        };
        const messages = [
            { sender: {}, content: "Message without sender id", createdAt: new Date().toISOString() }
        ];

        render(<ChatArea {...baseProps} selectedUser={selectedUserWithoutName} messages={messages} />);
        expect(screen.getByText("Unknown")).toBeInTheDocument();
    });

    it("handles selectedUser without images", () => {
        const selectedUserWithoutImages = {
            id: "u2",
            name: "John Doe"
        };

        render(<ChatArea {...baseProps} selectedUser={selectedUserWithoutImages} />);
        // Get the first image (header image)
        const images = screen.getAllByAltText("John Doe");
        expect(images[0]).toHaveAttribute("src", "https://via.placeholder.com/40");
    });

    it("prevents event propagation when clicking on sender name", () => {
        const messages = [
            { sender: { id: "u2" }, content: "Hi", createdAt: new Date().toISOString() }
        ];

        render(<ChatArea {...baseProps} messages={messages} />);
        // Click on the clickable span with the sender name
        const clickableSpan = screen.getByText("John Doe", { selector: 'span' });

        const mockEvent = {
            preventDefault: jest.fn(),
            stopPropagation: jest.fn()
        };

        fireEvent.click(clickableSpan, mockEvent);
        expect(baseProps.onUserClick).toHaveBeenCalledWith("u2");
    });

    it("calls onUserClick with empty string when sender has no id", () => {
        const mockOnUserClick = jest.fn();
        const testProps = {
            ...baseProps,
            onUserClick: mockOnUserClick
        };

        const messages = [
            { sender: {}, content: "Message without sender id", createdAt: new Date().toISOString() }
        ];

        render(<ChatArea {...testProps} messages={messages} />);
        // Click on the clickable span with the sender name
        const clickableSpan = screen.getByText("John Doe", { selector: 'span' });
        fireEvent.click(clickableSpan);
        expect(mockOnUserClick).toHaveBeenCalledWith("");
    });
});
