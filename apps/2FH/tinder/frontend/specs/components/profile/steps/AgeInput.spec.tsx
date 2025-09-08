// AgeInput.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AgeInput } from "@/components/profile/steps/AgeInput";
import { useSignup } from "@/components/profile/SignupContext";
import { validateField } from "@/utils/profile-validation";

jest.mock("@/components/profile/SignupContext");
jest.mock("@/utils/profile-validation");

const mockUseSignup = useSignup as jest.MockedFunction<typeof useSignup>;
const mockValidateField = validateField as jest.MockedFunction<typeof validateField>;

describe("AgeInput", () => {
    const mockHandleInputChange = jest.fn();
    const mockNextStep = jest.fn();
    const mockPrevStep = jest.fn();

    const setup = (dateOfBirth = "") => {
        const ctx = { signupData: { dateOfBirth }, handleInputChange: mockHandleInputChange, nextStep: mockNextStep, prevStep: mockPrevStep };
        mockUseSignup.mockReturnValue(ctx as any);
        render(<AgeInput />);
        return ctx;
    };

    beforeEach(() => jest.clearAllMocks());

    it("renders UI elements", () => {
        setup();
        expect(screen.getByText("Date of birth")).toBeInTheDocument();
        expect(screen.getByDisplayValue("")).toBeInTheDocument();
        expect(screen.getByText("Your date of birth is used to calculate your age.")).toBeInTheDocument();
        expect(screen.getByText("Back")).toBeInTheDocument();
        expect(screen.getByText("Next")).toBeInTheDocument();
    });

    it("Next disabled when no date", () => {
        setup("");
        expect(screen.getByText("Next")).toBeDisabled();
    });

    it("Next enabled with valid date", () => {
        setup("1990-01-01");
        expect(screen.getByText("Next")).not.toBeDisabled();
    });

    it("Back button triggers prevStep", () => {
        setup();
        fireEvent.click(screen.getByText("Back"));
        expect(mockPrevStep).toHaveBeenCalledTimes(1);
    });

    it("Next button triggers nextStep when valid", () => {
        setup("1990-01-01");
        fireEvent.click(screen.getByText("Next"));
        expect(mockNextStep).toHaveBeenCalledTimes(1);
    });

    it("valid input calls handleInputChange with no error", () => {
        setup();
        mockValidateField.mockReturnValue({ success: true, error: null });
        const input = screen.getByDisplayValue("");
        fireEvent.change(input, { target: { value: "1990-01-01" } });
        expect(mockValidateField).toHaveBeenCalledWith("dateOfBirth", "1990-01-01");
        expect(mockHandleInputChange).toHaveBeenCalledWith({ dateOfBirth: "1990-01-01" });
        expect(screen.queryByText(/Алдаа/i)).not.toBeInTheDocument();
    });

    it("invalid input shows error text", () => {
        setup();
        mockValidateField.mockReturnValue({ success: false, error: "Нас 18 хүрээгүй байна" });
        const input = screen.getByDisplayValue("");
        fireEvent.change(input, { target: { value: "2020-01-01" } });
        expect(screen.getByText("Нас 18 хүрээгүй байна")).toBeInTheDocument();
    });

    it("undefined error falls back to 'Алдаа'", () => {
        setup();
        mockValidateField.mockReturnValue({ success: false, error: undefined });
        const input = screen.getByDisplayValue("");
        fireEvent.change(input, { target: { value: "2025-12-31" } });
        expect(screen.getByText("Алдаа")).toBeInTheDocument();
    });

    it("input has correct error/normal styling", () => {
        setup();
        const input = screen.getByDisplayValue("");
        mockValidateField.mockReturnValue({ success: false, error: "Error" });
        fireEvent.change(input, { target: { value: "2020-01-01" } });
        expect(input).toHaveClass("border-red-500");
        mockValidateField.mockReturnValue({ success: true, error: null });
        fireEvent.change(input, { target: { value: "1990-01-01" } });
        expect(input).toHaveClass("border-gray-300");
    });

    it("Next button disabled styling when no date", () => {
        setup("");
        const nextButton = screen.getByText("Next");
        expect(nextButton).toHaveClass("bg-gray-300");
        expect(nextButton).toHaveClass("cursor-not-allowed");
    });

    it("Next button enabled styling when valid date", () => {
        setup("1990-01-01");
        const nextButton = screen.getByText("Next");
        expect(nextButton).toHaveClass("bg-[#E11D48E5]");
        expect(nextButton).not.toHaveClass("bg-gray-300");
    });

    it("handles multiple date changes", () => {
        setup();
        mockValidateField
            .mockReturnValueOnce({ success: false, error: "Хэт залуу" })
            .mockReturnValueOnce({ success: true, error: null });
        const input = screen.getByDisplayValue("");
        fireEvent.change(input, { target: { value: "2020-01-01" } });
        expect(screen.getByText("Хэт залуу")).toBeInTheDocument();
        fireEvent.change(input, { target: { value: "1990-01-01" } });
        expect(screen.queryByText("Хэт залуу")).not.toBeInTheDocument();
    });

    it("displays existing and empty date values from context", () => {
        setup("1995-05-15");
        expect(screen.getByDisplayValue("1995-05-15")).toBeInTheDocument();
        setup("");
        expect(screen.getByDisplayValue("")).toBeInTheDocument();
    });

    it("checks container and input CSS classes", () => {
        setup("1990-01-01");
        const container = screen.getByText("Date of birth").closest("div")?.parentElement?.parentElement;
        expect(container).toHaveClass("flex", "flex-col", "items-center", "bg-white", "h-full");
        const input = screen.getByDisplayValue("1990-01-01");
        expect(input).toHaveClass("focus:ring-2", "focus:ring-pink-500", "focus:border-transparent");
    });

    it("button hover classes are applied", () => {
        setup("1990-01-01");
        expect(screen.getByText("Back")).toHaveClass("hover:bg-gray-50");
        expect(screen.getByText("Next")).toHaveClass("hover:opacity-80");
    });
});
