// SignupContainer.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SignupContainer } from "@/components/profile/SignupContainer";

jest.mock("@/components/profile/SignupContext", () => ({
    useSignup: jest.fn(),
}));
import { useSignup } from "@/components/profile/SignupContext";

// Dummy steps mock
jest.mock("@/components/profile/steps/GenderSelection", () => ({
    GenderSelection: () => <div>GenderSelection</div>,
}));
jest.mock("@/components/profile/steps/InterestedIn", () => ({
    InterestedInSelection: () => <div>InterestedInSelection</div>,
}));
jest.mock("@/components/profile/steps/AgeInput", () => ({
    AgeInput: () => <div>AgeInput</div>,
}));
jest.mock("@/components/profile/steps/BasicDetails", () => ({
    BasicDetails: () => <div>BasicDetails</div>,
}));
jest.mock("@/components/profile/steps/ImageUpload", () => ({
    ImageUpload: () => <div>ImageUpload</div>,
}));
jest.mock("@/components/profile/steps/Completion", () => ({
    Completion: () => <div>Completion</div>,
}));

describe("SignupContainer", () => {
    const setup = (step: number) => {
        (useSignup as jest.Mock).mockReturnValue({ currentStep: step });
        render(<SignupContainer />);
    };

    const cases = [
        {
            step: 0,
            comp: "GenderSelection",
            title: "What's your gender?",
            subtitle: "Pick the one that feels right for you!",
        },
        {
            step: 1,
            comp: "InterestedInSelection",
            title: "Who are you interested in?",
            subtitle: "Pick the one that feels right for you!",
        },
        {
            step: 2,
            comp: "AgeInput",
            title: "How old are you?",
            subtitle: "Please enter your age to continue.",
        },
        {
            step: 3,
            comp: "BasicDetails",
            title: "Your basic details",
            subtitle:
                "Please provide the following information to help us get to know you better.",
        },
        {
            step: 4,
            comp: "ImageUpload",
            title: "Upload your image",
            subtitle: "Please choose an image that represents you.",
        },
        {
            step: 5,
            comp: "Completion",
            title: "You're all set!",
            subtitle:
                "Your account is all set. You're ready to explore and connect!",
        },
    ];

    it.each(cases)(
        "renders correct content at step $step",
        ({ step, comp, title, subtitle }) => {
            setup(step);
            expect(screen.getByText(comp)).toBeInTheDocument();
            expect(screen.getByText(title)).toBeInTheDocument();
            expect(screen.getByText(subtitle)).toBeInTheDocument();
        }
    );

    it("falls back to GenderSelection for invalid step", () => {
        setup(999);
        expect(screen.getByText("GenderSelection")).toBeInTheDocument();
        // Title/subtitle should not exist for invalid step
        expect(
            screen.queryByText("What's your gender?")
        ).not.toBeInTheDocument();
    });

    it("renders logo and footer", () => {
        setup(0);
        expect(screen.getByAltText("Tinder")).toBeInTheDocument();
        expect(screen.getByText("©2024 Tinder")).toBeInTheDocument();
    });

    it("has correct container and step styles", () => {
        setup(0);
        const container = screen.getByAltText("Tinder").closest("div");
        expect(container).toHaveClass("text-center", "w-[500px]");
        const stepContainer = screen.getByText("GenderSelection").closest(".h-\\[400px\\]");
        expect(stepContainer).toHaveClass("h-[400px]");
    });

    it("shows title and subtitle for completion step (step 5) in test environment", () => {
        setup(5);
        expect(screen.getByText("Completion")).toBeInTheDocument();
        // In test environment, title and subtitle are shown due to process.env.NODE_ENV === 'test'
        expect(screen.getByText("You're all set!")).toBeInTheDocument();
        expect(screen.getByText("Your account is all set. You're ready to explore and connect!")).toBeInTheDocument();
    });

    it("shows title and subtitle for all other steps", () => {
        // Test a few steps to ensure title/subtitle are shown
        setup(0);
        expect(screen.getByText("What's your gender?")).toBeInTheDocument();
        expect(screen.getByText("Pick the one that feels right for you!")).toBeInTheDocument();

        setup(2);
        expect(screen.getByText("How old are you?")).toBeInTheDocument();
        expect(screen.getByText("Please enter your age to continue.")).toBeInTheDocument();
    });
});
