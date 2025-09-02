import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { GenderSelection } from "@/components/profile/steps/GenderSelection";
import { useSignup } from "@/components/profile/SignupContext";

// ✅ useSignup mock хийх
jest.mock("@/components/profile/SignupContext");

describe("GenderSelection Component", () => {
    const mockNextStep = jest.fn();
    const mockHandleInputChange = jest.fn();

    const setup = (gender = "") => {
        (useSignup as jest.Mock).mockReturnValue({
            signupData: { gender },
            handleInputChange: mockHandleInputChange,
            nextStep: mockNextStep,
        });

        return render(<GenderSelection />);
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders input with placeholder when no gender selected", () => {
        setup();
        const input = screen.getByPlaceholderText("Select gender");
        expect(input).toBeInTheDocument();
    });

    it("renders input with selected gender", () => {
        setup("Male");
        const input = screen.getByDisplayValue("Male");
        expect(input).toBeInTheDocument();
    });

    it("opens dropdown on input focus", () => {
        setup();
        const input = screen.getByPlaceholderText("Select gender");
        act(() => {
            fireEvent.focus(input);
        });
        const option = screen.getByText("Male");
        expect(option).toBeVisible();
    });

    it("closes dropdown and calls handleInputChange on gender select", () => {
        setup();
        const input = screen.getByPlaceholderText("Select gender");
        act(() => {
            fireEvent.focus(input);
        });

        const femaleOption = screen.getByText("Female");
        act(() => {
            fireEvent.click(femaleOption);
        });

        expect(mockHandleInputChange).toHaveBeenCalledWith({ gender: "Female" });
        // Dropdown should close - check that dropdown is not in document
        expect(screen.queryByText("Male")).not.toBeInTheDocument();
    });

    it("Next button is disabled when no gender selected", () => {
        setup();
        const nextButton = screen.getByRole("button", { name: /Next/i });
        expect(nextButton).toBeDisabled();
    });

    it("Next button is enabled when gender is selected", () => {
        setup("Male");
        const nextButton = screen.getByRole("button", { name: /Next/i });
        expect(nextButton).toBeEnabled();
    });

    it("calls nextStep on Next button click", () => {
        setup("Male");
        const nextButton = screen.getByRole("button", { name: /Next/i });
        act(() => {
            fireEvent.click(nextButton);
        });
        expect(mockNextStep).toHaveBeenCalled();
    });

    it("toggles dropdown on dropdown button click", () => {
        setup();
        const genderInput = screen.getByPlaceholderText("Select gender");
        const dropdownButton = genderInput.parentElement?.querySelector('button');

        act(() => {
            fireEvent.click(dropdownButton!);
        });
        // Dropdown should be open
        expect(screen.getByText("Male")).toBeVisible();

        // Click again to close
        act(() => {
            fireEvent.click(dropdownButton!);
        });
        // Dropdown should be closed
        expect(screen.queryByText("Male")).not.toBeInTheDocument();
    });

    it("closes dropdown when clicking outside", () => {
        setup();
        const input = screen.getByPlaceholderText("Select gender");

        // Open dropdown
        act(() => {
            fireEvent.focus(input);
        });
        expect(screen.getByText("Male")).toBeVisible();

        // Click outside the dropdown
        act(() => {
            fireEvent.mouseDown(document.body);
        });

        // Dropdown should be closed
        expect(screen.queryByText("Male")).not.toBeInTheDocument();
    });

    it("does not close dropdown when clicking inside", () => {
        setup();
        const input = screen.getByPlaceholderText("Select gender");

        // Open dropdown
        act(() => {
            fireEvent.focus(input);
        });
        expect(screen.getByText("Male")).toBeVisible();

        // Click inside the dropdown (on the input itself)
        act(() => {
            fireEvent.mouseDown(input);
        });

        // Dropdown should still be open
        expect(screen.getByText("Male")).toBeVisible();
    });

    it("renders footer", () => {
        setup();
        expect(screen.getByText("©2024 Tinder")).toBeInTheDocument();
    });

    it("renders gender heading", () => {
        setup();
        expect(screen.getByText("Gender")).toBeInTheDocument();
    });
});
