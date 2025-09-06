import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import LoadingSpinner from "@/components/chat/LoadingSpinner";

describe("LoadingSpinner", () => {
    it("renders with default props", () => {
        const { container } = render(<LoadingSpinner />);

        expect(container.firstChild).toBeInTheDocument();
        expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("renders with small size", () => {
        const { container } = render(<LoadingSpinner size="sm" />);

        expect(container.firstChild).toBeInTheDocument();
        expect(screen.getByText("Loading...")).toBeInTheDocument();

        // Check that the spinner has the correct size classes
        const spinnerElement = container.querySelector('.animate-spin');
        expect(spinnerElement).toHaveClass("h-6", "w-6");
    });

    it("renders with medium size (default)", () => {
        const { container } = render(<LoadingSpinner size="md" />);

        expect(container.firstChild).toBeInTheDocument();
        expect(screen.getByText("Loading...")).toBeInTheDocument();

        // Check that the spinner has the correct size classes
        const spinnerElement = container.querySelector('.animate-spin');
        expect(spinnerElement).toHaveClass("h-12", "w-12");
    });

    it("renders with large size", () => {
        const { container } = render(<LoadingSpinner size="lg" />);

        expect(container.firstChild).toBeInTheDocument();
        expect(screen.getByText("Loading...")).toBeInTheDocument();

        // Check that the spinner has the correct size classes
        const spinnerElement = container.querySelector('.animate-spin');
        expect(spinnerElement).toHaveClass("h-16", "w-16");
    });

    it("renders with custom message", () => {
        render(<LoadingSpinner message="Please wait..." />);

        expect(screen.getByText("Please wait...")).toBeInTheDocument();
    });

    it("renders with custom className", () => {
        const { container } = render(<LoadingSpinner className="my-custom-class" />);

        const spinnerDiv = container.firstChild as HTMLElement;
        expect(spinnerDiv).toHaveClass("my-custom-class");
    });

    it("renders with all custom props", () => {
        const { container } = render(
            <LoadingSpinner
                size="lg"
                message="Processing data..."
                className="custom-spinner-class"
            />
        );

        expect(container.firstChild).toBeInTheDocument();
        expect(screen.getByText("Processing data...")).toBeInTheDocument();

        // Check size classes
        const spinnerElement = container.querySelector('.animate-spin');
        expect(spinnerElement).toHaveClass("h-16", "w-16");

        // Check custom className
        const spinnerDiv = container.firstChild as HTMLElement;
        expect(spinnerDiv).toHaveClass("custom-spinner-class");
    });

    it("renders with empty message", () => {
        const { container } = render(<LoadingSpinner message="" />);

        expect(container.firstChild).toBeInTheDocument();
        const messageElement = container.querySelector('p');
        expect(messageElement).toHaveTextContent("");
    });

    it("renders with null message", () => {
        const { container } = render(<LoadingSpinner message={null as any} />);

        expect(container.firstChild).toBeInTheDocument();
        const messageElement = container.querySelector('p');
        expect(messageElement).toHaveTextContent("");
    });

    it("renders with undefined message", () => {
        const { container } = render(<LoadingSpinner message={undefined} />);

        expect(container.firstChild).toBeInTheDocument();
        expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("renders with empty className", () => {
        const { container } = render(<LoadingSpinner className="" />);

        expect(container.firstChild).toBeInTheDocument();
        expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("renders with null className", () => {
        const { container } = render(<LoadingSpinner className={null as any} />);

        expect(container.firstChild).toBeInTheDocument();
        expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("renders with undefined className", () => {
        const { container } = render(<LoadingSpinner className={undefined} />);

        expect(container.firstChild).toBeInTheDocument();
        expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("renders with all size variants and checks text sizes", () => {
        // Test small size text
        const { rerender } = render(<LoadingSpinner size="sm" message="Small" />);
        let textElement = screen.getByText("Small");
        expect(textElement).toHaveClass("text-sm");

        // Test medium size text
        rerender(<LoadingSpinner size="md" message="Medium" />);
        textElement = screen.getByText("Medium");
        expect(textElement).toHaveClass("text-lg");

        // Test large size text
        rerender(<LoadingSpinner size="lg" message="Large" />);
        textElement = screen.getByText("Large");
        expect(textElement).toHaveClass("text-xl");
    });
});