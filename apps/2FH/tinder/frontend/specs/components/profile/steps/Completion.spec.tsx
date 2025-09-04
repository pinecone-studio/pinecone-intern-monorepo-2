// Completion.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Completion } from "@/components/profile/steps/Completion";
import { useSignup } from "@/components/profile/SignupContext";

jest.mock("@/components/profile/SignupContext");

const mockUseSignup = useSignup as jest.MockedFunction<typeof useSignup>;

describe("Completion Component", () => {
    const mockGoToStep = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseSignup.mockReturnValue({
            signupData: {},
            goToStep: mockGoToStep,
        } as any);
    });

    it("renders success icon and message", () => {
        render(<Completion />);
        // Check for SVG element by its path content
        expect(screen.getByText("You're all set!")).toBeInTheDocument();
        expect(screen.getByText("Your account is all set. Start swiping to find your match!")).toBeInTheDocument();
        // Check for the success icon container
        const iconContainer = screen.getByText("You're all set!").closest("div")?.previousElementSibling;
        expect(iconContainer).toHaveClass("flex", "justify-center");
    });

    it("calls alert when 'Start Swiping' button clicked", () => {
        render(<Completion />);
        window.alert = jest.fn();
        const button = screen.getByText("Start Swiping");
        fireEvent.click(button);
        expect(window.alert).toHaveBeenCalledWith(
            'Welcome to Tinder! Start swiping to find your match!'
        );
    });


    it("renders all UI elements correctly", () => {
        render(<Completion />);
        expect(screen.getByText("Start Swiping")).toBeInTheDocument();
        expect(screen.getByText("You're all set!")).toBeInTheDocument();
        expect(screen.getByText("Your account is all set. Start swiping to find your match!")).toBeInTheDocument();
    });

    it("applies correct CSS classes to elements", () => {
        render(<Completion />);
        const startButton = screen.getByText("Start Swiping");
        expect(startButton).toHaveClass("py-2", "px-2", "bg-pink-500", "hover:bg-pink-600", "text-white", "font-bold", "text-lg", "rounded-full");

        const heading = screen.getByText("You're all set!");
        expect(heading).toHaveClass("text-2xl", "font-bold", "text-gray-800");
    });
});
