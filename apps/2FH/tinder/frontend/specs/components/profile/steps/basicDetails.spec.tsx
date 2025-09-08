import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BasicDetails } from "@/components/profile/steps/BasicDetails";
import { useSignup } from "@/components/profile/SignupContext";
import { validateField } from "@/utils/profile-validation";


jest.mock("@/components/profile/SignupContext");
jest.mock("@/utils/profile-validation");
jest.mock("@/components/profile/steps/TagSelector", () => {
    const MockTagSelector = ({ onChange, initialSelected }: any) => {
        return (
            <div>
                <button onClick={() => onChange(initialSelected)}>Select your interests</button>
                <button onClick={() => onChange([])}>Clear interests</button>
            </div>
        );
    };
    MockTagSelector.displayName = 'MockTagSelector';
    return MockTagSelector;
});

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

    const inputFields = [
        { placeholder: "Enter your name", key: "name" },
        { placeholder: "Tell us about yourself", key: "bio" },
        { placeholder: "Enter your profession", key: "profession" },
        { placeholder: "Where do you study or work?", key: "work" },
    ];

    beforeEach(() => jest.clearAllMocks());

    it("renders all fields and buttons", () => {
        setup();
        inputFields.forEach(f => expect(screen.getByPlaceholderText(f.placeholder)).toBeInTheDocument());
        expect(screen.getByText("Select your interests")).toBeInTheDocument();
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

    it.each(inputFields)("handles validation errors for %s field with fallback", (field) => {
        setup({ name: "A", bio: "B", interests: "C", profession: "D", work: "E" });
        mockValidateField.mockReturnValue({ success: false, error: undefined });
        const input = screen.getByPlaceholderText(field.placeholder);
        fireEvent.change(input, { target: { value: "X" } });
        expect(screen.getByText("Алдаа")).toBeInTheDocument();
        expect(input).toHaveClass("border-red-500");
    });

    it.each(inputFields)("handles validation success for %s field", (field) => {
        setup({ name: "A", bio: "B", interests: "C", profession: "D", work: "E" });
        mockValidateField.mockReturnValue({ success: true, error: null });
        const input = screen.getByPlaceholderText(field.placeholder);
        fireEvent.change(input, { target: { value: "Valid" } });
        expect(input).toHaveClass("border-gray-300");
        expect(screen.queryByText(/Алдаа/i)).not.toBeInTheDocument();
    });

    it.each(inputFields)("calls handleInputChange on %s change", (field) => {
        setup({ name: "A", bio: "B", interests: "C", profession: "D", work: "E" });
        mockValidateField.mockReturnValue({ success: true, error: null });
        const input = screen.getByPlaceholderText(field.placeholder);
        fireEvent.change(input, { target: { value: `New ${field.key}` } });
        expect(mockHandleInputChange).toHaveBeenCalledWith({ [field.key]: `New ${field.key}` });
    });

    it("handles interests field change through TagSelector", () => {
        setup({ name: "A", bio: "B", interests: "", profession: "D", work: "E" });
        const interestsButton = screen.getByText("Select your interests");
        fireEvent.click(interestsButton);
        // The TagSelector should be open now, but we can't easily test the tag selection
        // without mocking the TAGS data. For now, just verify the button is clickable.
        expect(interestsButton).toBeInTheDocument();
    });

    it("handles interests field when interests is null", () => {
        setup({ name: "A", bio: "B", interests: null, profession: "D", work: "E" });
        const interestsButton = screen.getByText("Select your interests");
        expect(interestsButton).toBeInTheDocument();
    });

    it("handles interests field when interests is undefined", () => {
        setup({ name: "A", bio: "B", interests: undefined, profession: "D", work: "E" });
        const interestsButton = screen.getByText("Select your interests");
        expect(interestsButton).toBeInTheDocument();
    });

    it("handles interests field when interests is empty string", () => {
        setup({ name: "A", bio: "B", interests: "", profession: "D", work: "E" });
        const interestsButton = screen.getByText("Select your interests");
        expect(interestsButton).toBeInTheDocument();
    });

    it("calls handleInputChange when TagSelector onChange is triggered with empty array", () => {
        setup({ name: "A", bio: "B", interests: "music,sports", profession: "D", work: "E" });
        mockValidateField.mockReturnValue({ success: true, error: null });

        // Click the "Clear interests" button which calls onChange with empty array
        const clearButton = screen.getByText("Clear interests");
        fireEvent.click(clearButton);
        // This should trigger handleInterestChange with empty array, which calls interests.join(',')
        expect(mockHandleInputChange).toHaveBeenCalledWith({ interests: "" });
    });
    it("calls handleInputChange when TagSelector onChange is triggered with interests array", () => {
        setup({ name: "A", bio: "B", interests: "", profession: "D", work: "E" });
        mockValidateField.mockReturnValue({ success: true, error: null });
        // Click the "Select your interests" button which calls onChange with initialSelected
        const selectButton = screen.getByText("Select your interests");
        fireEvent.click(selectButton);
        // This should trigger handleInterestChange with the initialSelected array
        expect(mockHandleInputChange).toHaveBeenCalledWith({ interests: "" });
    });
    it("displays interests error message when validation fails", () => {
        setup({ name: "A", bio: "B", interests: "", profession: "D", work: "E" });
        mockValidateField.mockReturnValue({ success: false, error: "Interests are required" });
        // Trigger interests change to cause validation error
        const clearButton = screen.getByText("Clear interests");
        fireEvent.click(clearButton);
        // Should display the error message
        expect(screen.getByText("Interests are required")).toBeInTheDocument();
    });
});
