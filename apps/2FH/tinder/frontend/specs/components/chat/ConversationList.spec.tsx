import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ConversationsList } from "@/components/chat/ConversationList";
import { MatchedUser } from "@/types/chat-types";

// Mock calculateAge
jest.mock("@/utils/chat-utils", () => ({
    calculateAge: jest.fn(() => 25),
}));

const mockUser: MatchedUser = {
    id: "u1",
    userId: "u1",
    name: "Alice",
    dateOfBirth: "1998-01-01",
    work: "Engineer",
    images: ["https://via.placeholder.com/50"],
};

describe("ConversationsList", () => {
    it("renders empty state when no matches", () => {
        render(<ConversationsList matches={[]} selectedUser={null} onUserSelect={jest.fn()} />);
        expect(screen.getByText("No conversations yet")).toBeInTheDocument();
        expect(screen.getByText("Start chatting with your matches!")).toBeInTheDocument();
    });

    it("renders matches with user info", () => {
        render(<ConversationsList matches={[mockUser]} selectedUser={null} onUserSelect={jest.fn()} />);
        expect(screen.getByText("Alice")).toBeInTheDocument();
        expect(screen.getByText("Engineer")).toBeInTheDocument();
        expect(screen.getByText("25")).toBeInTheDocument(); // from mocked calculateAge
    });

    it("renders fallback for missing work", () => {
        const noWorkUser = { ...mockUser, userId: "u2", work: "" };
        render(<ConversationsList matches={[noWorkUser]} selectedUser={null} onUserSelect={jest.fn()} />);
        expect(screen.getByText("No work info")).toBeInTheDocument();
    });

    it("does not render age when dateOfBirth is missing", () => {
        const userWithoutDob = { ...mockUser, userId: "u3", dateOfBirth: undefined as any };
        render(<ConversationsList matches={[userWithoutDob]} selectedUser={null} onUserSelect={jest.fn()} />);
        // Нас харагдахгүй байх ёстой
        expect(screen.queryByText("25")).not.toBeInTheDocument();
    });

    it("calls onUserSelect when user is clicked", () => {
        const onUserSelect = jest.fn();
        render(<ConversationsList matches={[mockUser]} selectedUser={null} onUserSelect={onUserSelect} />);
        fireEvent.click(screen.getByText("Alice"));
        expect(onUserSelect).toHaveBeenCalledWith(mockUser);
    });

    it("applies selectedUser highlight", () => {
        const { container } = render(<ConversationsList matches={[mockUser]} selectedUser={mockUser} onUserSelect={jest.fn()} />);
        const userDiv = container.querySelector('[class*="bg-gray-50"]');
        expect(userDiv).toBeInTheDocument();
    });

    it("renders online indicator", () => {
        const { container } = render(<ConversationsList matches={[mockUser]} selectedUser={null} onUserSelect={jest.fn()} />);
        const onlineIndicator = container.querySelector('.bg-green-400');
        expect(onlineIndicator).toBeInTheDocument();
        expect(onlineIndicator).toHaveClass("absolute", "-bottom-1", "-right-1", "w-4", "h-4", "bg-green-400", "border-2", "border-white", "rounded-full");
    });

    it("renders verified badge", () => {
        render(<ConversationsList matches={[mockUser]} selectedUser={null} onUserSelect={jest.fn()} />);
        const verifiedBadge = screen.getByText("✓");
        expect(verifiedBadge).toBeInTheDocument();
        expect(verifiedBadge.parentElement).toHaveClass("w-4", "h-4", "bg-blue-500", "rounded-full", "flex", "items-center", "justify-center");
    });

    it("renders fallback image when no images provided", () => {
        const userWithoutImages = { ...mockUser, userId: "u4", images: [] };
        render(<ConversationsList matches={[userWithoutImages]} selectedUser={null} onUserSelect={jest.fn()} />);
        const image = screen.getByRole("img");
        expect(image).toHaveAttribute("src", "https://via.placeholder.com/50");
    });

    it("renders fallback name when name is missing", () => {
        const userWithoutName = { ...mockUser, userId: "u5", name: "" };
        render(<ConversationsList matches={[userWithoutName]} selectedUser={null} onUserSelect={jest.fn()} />);
        expect(screen.getByText("Unknown")).toBeInTheDocument();
    });
});
