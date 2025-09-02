import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BasicDetails } from "@/components/profile/steps/BasicDetails";
import { useSignup } from "@/components/profile/SignupContext";
import { validateField } from "@/utils/profile-validation";

jest.mock("@/components/profile/SignupContext");
jest.mock("@/utils/profile-validation");

const mockUseSignup = useSignup as jest.MockedFunction<typeof useSignup>;
const mockValidateField = validateField as jest.MockedFunction<typeof validateField>;

describe("BasicDetails", () => {
    const mockHandleInputChange = jest.fn();
    const mockNextStep = jest.fn();
    const mockPrevStep = jest.fn();

    const setup = (data = { name: "", bio: "", interests: "", profession: "", work: "" }) => {
        mockUseSignup.mockReturnValue({
            signupData: data,
            handleInputChange: mockHandleInputChange,
            nextStep: mockNextStep,
            prevStep: mockPrevStep,
        } as any);
        render(<BasicDetails />);
    };

    const fields = [
        { placeholder: "Enter your name", key: "name" },
        { placeholder: "Tell us about yourself", key: "bio" },
        { placeholder: "What are your interests?", key: "interests" },
        { placeholder: "Enter your profession", key: "profession" },
        { placeholder: "Where do you study or work?", key: "work" },
    ];

    beforeEach(() => jest.clearAllMocks());

    it("renders all fields and buttons", () => {
        setup();
        fields.forEach(f => expect(screen.getByPlaceholderText(f.placeholder)).toBeInTheDocument());
        expect(screen.getByText("Back")).toBeInTheDocument();
        expect(screen.getByText("Next")).toBeInTheDocument();
    });

    it("calls prevStep on Back button click", () => {
        setup();
        fireEvent.click(screen.getByText("Back"));
        expect(mockPrevStep).toHaveBeenCalledTimes(1);
    });

    it("disables Next button if required fields empty or errors exist", () => {
        setup();
        const nextButton = screen.getByText("Next");
        expect(nextButton).toBeDisabled();
    });

    it("enables Next button if all fields valid", () => {
        setup({ name: "A", bio: "B", interests: "C", profession: "D", work: "E" });
        mockValidateField.mockReturnValue({ success: true, error: null });
        fireEvent.change(screen.getByPlaceholderText("Enter your name"), { target: { value: "A" } });
        const nextButton = screen.getByText("Next");
        expect(nextButton).not.toBeDisabled();
    });

    it.each(fields)("handles validation errors for %s field with fallback", (field) => {
        setup({ name: "A", bio: "B", interests: "C", profession: "D", work: "E" });
        mockValidateField.mockReturnValue({ success: false, error: undefined });
        const input = screen.getByPlaceholderText(field.placeholder);
        fireEvent.change(input, { target: { value: "X" } });
        expect(screen.getByText("Алдаа")).toBeInTheDocument();
        expect(input).toHaveClass("border-red-500");
    });

    it.each(fields)("handles validation success for %s field", (field) => {
        setup({ name: "A", bio: "B", interests: "C", profession: "D", work: "E" });
        mockValidateField.mockReturnValue({ success: true, error: null });
        const input = screen.getByPlaceholderText(field.placeholder);
        fireEvent.change(input, { target: { value: "Valid" } });
        expect(input).toHaveClass("border-gray-300");
        expect(screen.queryByText(/Алдаа/i)).not.toBeInTheDocument();
    });

    it.each(fields)("calls handleInputChange on %s change", (field) => {
        setup({ name: "A", bio: "B", interests: "C", profession: "D", work: "E" });
        mockValidateField.mockReturnValue({ success: true, error: null });
        const input = screen.getByPlaceholderText(field.placeholder);
        fireEvent.change(input, { target: { value: `New ${field.key}` } });
        expect(mockHandleInputChange).toHaveBeenCalledWith({ [field.key]: `New ${field.key}` });
    });
});
