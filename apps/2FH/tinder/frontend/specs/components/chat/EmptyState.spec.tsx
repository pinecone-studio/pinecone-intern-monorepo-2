import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import EmptyState from "@/components/chat/EmptyState";

describe("EmptyState", () => {
    it("renders with default props", () => {
        render(<EmptyState />);

        expect(screen.getByText("👤")).toBeInTheDocument();
        expect(screen.getByText("No data available")).toBeInTheDocument();
    });

    it("renders with custom icon", () => {
        render(<EmptyState icon="💬" />);

        expect(screen.getByText("💬")).toBeInTheDocument();
        expect(screen.getByText("No data available")).toBeInTheDocument();
    });

    it("renders with custom title", () => {
        render(<EmptyState title="No messages yet" />);

        expect(screen.getByText("👤")).toBeInTheDocument();
        expect(screen.getByText("No messages yet")).toBeInTheDocument();
    });

    it("renders with subtitle", () => {
        render(<EmptyState subtitle="Start a conversation" />);

        expect(screen.getByText("👤")).toBeInTheDocument();
        expect(screen.getByText("No data available")).toBeInTheDocument();
        expect(screen.getByText("Start a conversation")).toBeInTheDocument();
    });

    it("renders with custom className", () => {
        const { container } = render(<EmptyState className="custom-class" />);

        const emptyStateDiv = container.firstChild as HTMLElement;
        expect(emptyStateDiv).toHaveClass("custom-class");
    });

    it("renders with all custom props", () => {
        render(
            <EmptyState
                icon="🚫"
                title="Nothing here"
                subtitle="Try again later"
                className="my-custom-class"
            />
        );

        expect(screen.getByText("🚫")).toBeInTheDocument();
        expect(screen.getByText("Nothing here")).toBeInTheDocument();
        expect(screen.getByText("Try again later")).toBeInTheDocument();
    });

    it("does not render subtitle when not provided", () => {
        render(<EmptyState />);

        expect(screen.getByText("👤")).toBeInTheDocument();
        expect(screen.getByText("No data available")).toBeInTheDocument();
        expect(screen.queryByText("Start a conversation")).not.toBeInTheDocument();
    });

    it("renders with empty subtitle (falsy value)", () => {
        const { container } = render(<EmptyState subtitle="" />);

        expect(screen.getByText("👤")).toBeInTheDocument();
        expect(screen.getByText("No data available")).toBeInTheDocument();
        // Empty string subtitle should not render the subtitle element
        const subtitleElements = container.querySelectorAll('p');
        expect(subtitleElements).toHaveLength(1); // Only the title paragraph, no subtitle
    });

    it("renders with null subtitle", () => {
        render(<EmptyState subtitle={null as any} />);

        expect(screen.getByText("👤")).toBeInTheDocument();
        expect(screen.getByText("No data available")).toBeInTheDocument();
        expect(screen.queryByText("Start a conversation")).not.toBeInTheDocument();
    });

    it("renders with undefined subtitle", () => {
        render(<EmptyState subtitle={undefined} />);

        expect(screen.getByText("👤")).toBeInTheDocument();
        expect(screen.getByText("No data available")).toBeInTheDocument();
        expect(screen.queryByText("Start a conversation")).not.toBeInTheDocument();
    });
});