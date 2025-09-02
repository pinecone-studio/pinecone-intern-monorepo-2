// SignupContext.test.tsx
import React from "react";
import { renderHook, act } from "@testing-library/react";
import { SignupProvider, useSignup } from "@/components/profile/SignupContext";
import { toast } from "sonner";

jest.mock("@/generated", () => ({
    useCreateProfileMutation: jest.fn(),
    Gender: { Male: "male", Female: "female" },
}));
const mockCreateProfile = jest.fn();
import { useCreateProfileMutation } from "@/generated";
const mockUseCreateProfileMutation = useCreateProfileMutation;
jest.mock("sonner", () => ({ toast: { success: jest.fn(), error: jest.fn() } }));

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <SignupProvider userId="user-123">{children}</SignupProvider>
);

beforeEach(() => {
    jest.clearAllMocks();
    mockUseCreateProfileMutation.mockReturnValue([mockCreateProfile, { loading: false }]);
});

describe("SignupContext", () => {
    it("throws if used outside provider", () => {
        // Suppress console.error for this test since we expect an error
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);

        expect(() => renderHook(() => useSignup())).toThrow("useSignup must be used within a SignupProvider");

        consoleSpy.mockRestore();
    });

    it("has default values", () => {
        const { result } = renderHook(() => useSignup(), { wrapper });
        expect(result.current.currentStep).toBe(0);
        expect(result.current.signupData.userId).toBe("user-123");
    });

    it("nextStep/prevStep/goToStep work with bounds", () => {
        const { result } = renderHook(() => useSignup(), { wrapper });
        act(() => result.current.nextStep());
        expect(result.current.currentStep).toBe(1);
        act(() => result.current.goToStep(3));
        act(() => result.current.nextStep());
        expect(result.current.currentStep).toBe(4);
        act(() => result.current.prevStep());
        expect(result.current.currentStep).toBe(3);
        act(() => result.current.goToStep(99));
        expect(result.current.currentStep).toBe(3);
    });

    it("isComplete true only at step 4", () => {
        const { result } = renderHook(() => useSignup(), { wrapper });
        expect(result.current.isComplete).toBe(false);
        act(() => result.current.goToStep(4));
        expect(result.current.isComplete).toBe(true);
    });

    it("handleInputChange updates state", () => {
        const { result } = renderHook(() => useSignup(), { wrapper });
        act(() => result.current.handleInputChange({ name: "John" }));
        expect(result.current.signupData.name).toBe("John");
    });

    it("submitProfile calls mutation with all fields", async () => {
        const { result } = renderHook(() => useSignup(), { wrapper });
        act(() =>
            result.current.handleInputChange({
                name: "Jane",
                bio: "Hello",
                interests: "music,art",
                profession: "Designer",
                work: "Studio",
                gender: "Female",
                interestedIn: "Male",
                images: ["img.png"],
                dateOfBirth: "2000-01-01",
            })
        );
        await act(async () => result.current.submitProfile());
        expect(mockCreateProfile).toHaveBeenCalledWith({
            variables: {
                input: {
                    name: "Jane",
                    bio: "Hello",
                    interests: ["music", "art"],
                    profession: "Designer",
                    work: "Studio",
                    gender: "female",
                    interestedIn: "male",
                    images: ["img.png"],
                    dateOfBirth: "2000-01-01",
                    userId: "user-123",
                },
            },
        });
    });

    it("submitProfile falls back when bio/dateOfBirth missing", async () => {
        const { result } = renderHook(() => useSignup(), { wrapper });
        act(() =>
            result.current.handleInputChange({
                name: "NoBio",
                interests: "coding",
                profession: "Eng",
                work: "Office",
                gender: "Male",
            })
        );
        await act(async () => result.current.submitProfile());
        expect(mockCreateProfile).toHaveBeenCalledWith(
            expect.objectContaining({
                variables: expect.objectContaining({
                    input: expect.objectContaining({ bio: "", dateOfBirth: "" }),
                }),
            })
        );
    });

    it("triggers toast.success on completed", () => {
        mockUseCreateProfileMutation.mockImplementation((o: any) => {
            o.onCompleted();
            return [jest.fn(), { loading: false }];
        });
        renderHook(() => useSignup(), { wrapper });
        expect(toast.success).toHaveBeenCalled();
    });

    it("triggers toast.error on error", () => {
        const err = new Error("fail");
        mockUseCreateProfileMutation.mockImplementation((o: any) => {
            o.onError(err);
            return [jest.fn(), { loading: false, error: err }];
        });
        const { result } = renderHook(() => useSignup(), { wrapper });
        expect(toast.error).toHaveBeenCalled();
        expect(result.current.error).toBe("fail");
    });

    it("sets loading=true", () => {
        mockUseCreateProfileMutation.mockReturnValue([jest.fn(), { loading: true }]);
        const { result } = renderHook(() => useSignup(), { wrapper });
        expect(result.current.loading).toBe(true);
    });
});
