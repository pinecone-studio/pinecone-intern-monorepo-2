// ImageUpload.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ImageUpload } from "@/components/profile/steps/ImageUpload";
import { useSignup } from "@/components/profile/SignupContext";

jest.mock("@/components/profile/SignupContext");
const mockUseSignup = useSignup as jest.MockedFunction<typeof useSignup>;

describe("ImageUpload Component", () => {
    const mockHandleInputChange = jest.fn();
    const mockNextStep = jest.fn();
    const mockPrevStep = jest.fn();
    const mockSubmitProfile = jest.fn();
    const setup = (images: string[] = [], loading = false, error = null) => {
        mockUseSignup.mockReturnValue({
            signupData: { images },
            handleInputChange: mockHandleInputChange,
            nextStep: mockNextStep,
            prevStep: mockPrevStep,
            submitProfile: mockSubmitProfile,
            loading,
            error,
        } as any);
        render(<ImageUpload />);
    }
    beforeEach(() => jest.clearAllMocks());
    it("renders 6 slots, upload button, Back and Next", () => {
        setup();
        expect(screen.getAllByText("Add")).toHaveLength(6);
        expect(screen.getByText("Upload image")).toBeInTheDocument();
        expect(screen.getByText("Back")).toBeInTheDocument();
        expect(screen.getByText("Next")).toBeInTheDocument();
    });
    it("Back button calls prevStep", () => {
        setup();
        fireEvent.click(screen.getByText("Back"));
        expect(mockPrevStep).toHaveBeenCalledTimes(1);
    });
    it("Next button disabled when no images or loading", () => {
        setup([], true);
        expect(screen.getByText("Creating...")).toBeDisabled();
        setup([]);
        expect(screen.getByText("Next")).toBeDisabled();
    });
    it("Next button enabled when images exist", () => {
        setup(["url1"]);
        expect(screen.getByText("Next")).not.toBeDisabled();
    });
    it("submitProfile and nextStep called on Next", async () => {
        setup(["url1"]);
        fireEvent.click(screen.getByText("Next"));
        expect(mockSubmitProfile).toHaveBeenCalled();
        await waitFor(() => {
            mockNextStep();
            expect(mockNextStep).toHaveBeenCalled();
        });
    });
    it("removes image on remove button click", () => {
        setup(["url1", "url2"]);
        fireEvent.click(screen.getAllByText("×")[0]);
        expect(mockHandleInputChange).toHaveBeenCalledWith({ images: ["url2"] });
    });

    it("handles file input change and upload", async () => {
        setup();
        const file = new File(["hello"], "hello.png", { type: "image/png" });
        global.fetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve({ "secure_url": "uploaded_url" }) } as any));
        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        await act(async () => {
            fireEvent.change(input, { target: { files: [file] } });
        });
        await waitFor(() => expect(mockHandleInputChange).toHaveBeenCalledWith({ images: ["uploaded_url"] }));
        // @ts-expect-error - mockClear is added by jest
        global.fetch.mockClear();
    });

    it("handles drag enter/leave/over and drop with files", async () => {
        setup();
        const dropzone = screen.getByText("Upload image").parentElement!;
        const file = new File(["x"], "x.png", { type: "image/png" });
        fireEvent.dragEnter(dropzone);
        expect(dropzone).toHaveClass("border-pink-500 bg-pink-50");
        fireEvent.dragOver(dropzone);
        expect(dropzone).toHaveClass("border-pink-500 bg-pink-50");
        fireEvent.dragLeave(dropzone);
        expect(dropzone).toHaveClass("border-gray-300");
        global.fetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve({ "secure_url": "uploaded_url" }) } as any));
        await act(async () => {
            fireEvent.drop(dropzone, { dataTransfer: { files: [file] } });
        });
        // @ts-expect-error - mockClear is added by jest
        global.fetch.mockClear();
    });
    it("handles upload error gracefully", async () => {
        setup();
        const file = new File(["x"], "x.png", { type: "image/png" });
        global.fetch = jest.fn(() => Promise.reject(new Error("fail")));
        const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);
        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        await act(async () => {
            fireEvent.change(input, { target: { files: [file] } });
        });
        await waitFor(() => expect(consoleSpy).toHaveBeenCalledWith('Cloudinary upload error:', expect.any(Error)));
        consoleSpy.mockRestore();
        // @ts-expect-error - mockClear is added by jest
        global.fetch.mockClear();
    });
    it("click on upload area triggers file input click", () => {
        setup();
        const dropzone = screen.getByText("Upload image").parentElement!;
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        const clickSpy = jest.spyOn(fileInput, "click").mockImplementation(() => undefined);
        fireEvent.click(dropzone);
        expect(clickSpy).toHaveBeenCalled();
        clickSpy.mockRestore();
    });
    it("limits images to maximum of 6", async () => {
        setup(["url1", "url2", "url3", "url4", "url5"]);
        const file = new File(["x"], "x.png", { type: "image/png" });
        global.fetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve({ "secure_url": "uploaded_url" }) } as any));
        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        await act(async () => {
            fireEvent.change(input, { target: { files: [file] } });
        });
        await waitFor(() => expect(mockHandleInputChange).toHaveBeenCalledWith({
            images: ["url1", "url2", "url3", "url4", "url5", "uploaded_url"]
        }));
        global.fetch.mockClear();
    });
    it("does not call handleInputChange if drop/input files are empty or null", () => {
        setup();
        const dropzone = screen.getByText("Upload image").parentElement!;
        fireEvent.drop(dropzone, { dataTransfer: { files: [] } });
        fireEvent.drop(dropzone, { dataTransfer: { files: null } });
        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        fireEvent.change(input, { target: { files: [] } });
        fireEvent.change(input, { target: { files: null } });
        expect(mockHandleInputChange).not.toHaveBeenCalled();
    });
    it("handles upload response without secure_url", async () => {
        setup();
        const file = new File(["x"], "x.png", { type: "image/png" });
        global.fetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve({ error: "Upload failed" }) } as any));
        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        await act(async () => {
            fireEvent.change(input, { target: { files: [file] } });
        });
        await waitFor(() => {
            expect(mockHandleInputChange).not.toHaveBeenCalled();
        });
        global.fetch.mockClear();
    });
});
