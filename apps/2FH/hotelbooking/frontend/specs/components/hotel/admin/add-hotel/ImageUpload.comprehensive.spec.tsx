/* eslint-disable */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@/TestUtils';
import { ImageUpload } from '@/components/admin/add-hotel/ImageUpload';

// Mock next/image
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} data-testid="next-image" {...props} />;
  };
});

describe('ImageUpload - Comprehensive Tests', () => {
  const mockProps = {
    uploadedImages: [] as File[],
    imageUrls: [] as string[],
    onImagesChange: jest.fn(),
    onUrlsChange: jest.fn(),
  };

  let originalEnv: string | undefined;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    originalEnv = process.env.NODE_ENV;
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Reset fetch mock
    global.fetch = jest.fn();
  });

  afterEach(() => {
    if (originalEnv !== undefined) {
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: originalEnv,
        writable: true,
      });
    }
    consoleErrorSpy.mockRestore();
  });

  describe('1. Successful Cloudinary upload', () => {
    it('should successfully upload image to Cloudinary and call onUrlsChange with functional updater', async () => {
      const mockOnImagesChange = jest.fn();
      const mockOnUrlsChange = jest.fn();

      // Mock fetch to return successful response
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({
          secure_url: 'http://test.com/img.jpg',
        }),
      });

      render(<ImageUpload {...mockProps} onImagesChange={mockOnImagesChange} onUrlsChange={mockOnUrlsChange} />);

      const fileInput = screen.getByLabelText(/click to select images/i) as HTMLInputElement;
      const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      fireEvent.change(fileInput, {
        target: {
          files: [testFile],
        },
      });

      // Wait for the upload to complete
      await waitFor(() => {
        expect(mockOnImagesChange).toHaveBeenCalledWith([testFile]);
      });

      await waitFor(() => {
        expect(mockOnUrlsChange).toHaveBeenCalledWith(expect.any(Function));
      });

      // Verify the functional updater was called correctly
      const functionalUpdater = mockOnUrlsChange.mock.calls[0][0];
      const result = functionalUpdater(['existing-url']);
      expect(result).toEqual(['existing-url', 'http://test.com/img.jpg']);
    });

    it('should handle multiple successful uploads', async () => {
      const mockOnImagesChange = jest.fn();
      const mockOnUrlsChange = jest.fn();

      // Mock fetch to return successful responses
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({
          secure_url: 'http://test.com/multiple.jpg',
        }),
      });

      render(<ImageUpload {...mockProps} onImagesChange={mockOnImagesChange} onUrlsChange={mockOnUrlsChange} />);

      const fileInput = screen.getByLabelText(/click to select images/i) as HTMLInputElement;
      const testFile1 = new File(['test1'], 'test1.jpg', { type: 'image/jpeg' });
      const testFile2 = new File(['test2'], 'test2.jpg', { type: 'image/jpeg' });

      fireEvent.change(fileInput, {
        target: {
          files: [testFile1, testFile2],
        },
      });

      // Wait for both uploads to complete
      await waitFor(() => {
        expect(mockOnImagesChange).toHaveBeenCalledWith([testFile1, testFile2]);
      });

      await waitFor(() => {
        expect(mockOnUrlsChange).toHaveBeenCalledTimes(2);
      });

      // Verify both functional updaters were called correctly
      const firstUpdater = mockOnUrlsChange.mock.calls[0][0];
      const secondUpdater = mockOnUrlsChange.mock.calls[1][0];

      expect(firstUpdater([])).toEqual(['http://test.com/multiple.jpg']);
      expect(secondUpdater(['http://test.com/multiple.jpg'])).toEqual(['http://test.com/multiple.jpg', 'http://test.com/multiple.jpg']);
    });
  });

  describe('2. Error branch - fetch returns { ok: false }', () => {
    it('should handle Cloudinary upload failure and log error', async () => {
      const mockOnImagesChange = jest.fn();
      const mockOnUrlsChange = jest.fn();

      // Mock fetch to return error response
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: jest.fn().mockResolvedValue({
          error: { message: 'Upload failed' },
        }),
      });

      render(<ImageUpload {...mockProps} onImagesChange={mockOnImagesChange} onUrlsChange={mockOnUrlsChange} />);

      const fileInput = screen.getByLabelText(/click to select images/i) as HTMLInputElement;
      const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      fireEvent.change(fileInput, {
        target: {
          files: [testFile],
        },
      });

      // Wait for error to be logged
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error uploading image:', expect.any(Error));
      });

      // Verify the error message
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error uploading image:',
        expect.objectContaining({
          message: 'Upload failed',
        })
      );
    });

    it('should handle Cloudinary upload failure with generic error message', async () => {
      const mockOnImagesChange = jest.fn();
      const mockOnUrlsChange = jest.fn();

      // Mock fetch to return error response without specific error message
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: jest.fn().mockResolvedValue({}),
      });

      render(<ImageUpload {...mockProps} onImagesChange={mockOnImagesChange} onUrlsChange={mockOnUrlsChange} />);

      const fileInput = screen.getByLabelText(/click to select images/i) as HTMLInputElement;
      const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      fireEvent.change(fileInput, {
        target: {
          files: [testFile],
        },
      });

      // Wait for error to be logged
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error uploading image:', expect.any(Error));
      });

      // Verify the generic error message
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error uploading image:',
        expect.objectContaining({
          message: 'Failed to upload image to Cloudinary',
        })
      );
    });
  });

  describe('3. FileReader fallback in test environment', () => {
    it('should fallback to FileReader when fetch rejects and NODE_ENV is test', async () => {
      const mockOnImagesChange = jest.fn();
      const mockOnUrlsChange = jest.fn();

      // Set NODE_ENV to test
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'test',
        writable: true,
      });

      // Mock fetch to reject
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      // Mock FileReader
      const mockFileReader = {
        readAsDataURL: jest.fn(),
        onload: null as any,
      };
      const originalFileReader = global.FileReader;
      (global.FileReader as any) = jest.fn().mockImplementation(() => {
        setTimeout(() => {
          if (mockFileReader.onload) {
            mockFileReader.onload({ target: { result: 'data:image/png;base64,fake' } });
          }
        }, 0);
        return mockFileReader;
      });

      render(<ImageUpload {...mockProps} onImagesChange={mockOnImagesChange} onUrlsChange={mockOnUrlsChange} />);

      const fileInput = screen.getByLabelText(/click to select images/i) as HTMLInputElement;
      const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      fireEvent.change(fileInput, {
        target: {
          files: [testFile],
        },
      });

      // Wait for FileReader fallback to complete
      await waitFor(() => {
        expect(mockOnUrlsChange).toHaveBeenCalledWith(expect.any(Function));
      });

      // Verify the functional updater was called with the base64 string
      const functionalUpdater = mockOnUrlsChange.mock.calls[0][0];
      const result = functionalUpdater([]);
      expect(result).toEqual(['data:image/png;base64,fake']);

      // Restore FileReader
      global.FileReader = originalFileReader;
    });

    it('should not fallback to FileReader when NODE_ENV is not test', async () => {
      const mockOnImagesChange = jest.fn();
      const mockOnUrlsChange = jest.fn();

      // Set NODE_ENV to production
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'production',
        writable: true,
      });

      // Mock fetch to reject
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      render(<ImageUpload {...mockProps} onImagesChange={mockOnImagesChange} onUrlsChange={mockOnUrlsChange} />);

      const fileInput = screen.getByLabelText(/click to select images/i) as HTMLInputElement;
      const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      fireEvent.change(fileInput, {
        target: {
          files: [testFile],
        },
      });

      // Wait for error to be logged
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error uploading image:', expect.any(Error));
      });

      // Verify that onUrlsChange was not called (no fallback in production)
      expect(mockOnUrlsChange).not.toHaveBeenCalled();
    });

    it('should handle FileReader with invalid result', async () => {
      const mockOnImagesChange = jest.fn();
      const mockOnUrlsChange = jest.fn();

      // Set NODE_ENV to test
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'test',
        writable: true,
      });

      // Mock fetch to reject
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      // Mock FileReader with invalid result
      const mockFileReader = {
        readAsDataURL: jest.fn(),
        onload: null as any,
      };
      const originalFileReader = global.FileReader;
      (global.FileReader as any) = jest.fn().mockImplementation(() => {
        setTimeout(() => {
          if (mockFileReader.onload) {
            mockFileReader.onload({ target: { result: 'test' } }); // Invalid result
          }
        }, 0);
        return mockFileReader;
      });

      render(<ImageUpload {...mockProps} onImagesChange={mockOnImagesChange} onUrlsChange={mockOnUrlsChange} />);

      const fileInput = screen.getByLabelText(/click to select images/i) as HTMLInputElement;
      const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      fireEvent.change(fileInput, {
        target: {
          files: [testFile],
        },
      });

      // Wait for FileReader to complete
      await waitFor(() => {
        // Should not call onUrlsChange because result is 'test'
        expect(mockOnUrlsChange).not.toHaveBeenCalled();
      });

      // Restore FileReader
      global.FileReader = originalFileReader;
    });
  });

  describe('4. Remove image functionality', () => {
    it('should remove image when remove button is clicked', () => {
      const mockOnImagesChange = jest.fn();
      const mockOnUrlsChange = jest.fn();
      const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      render(<ImageUpload uploadedImages={[testFile]} imageUrls={['http://test.com/img1.jpg', 'http://test.com/img2.jpg']} onImagesChange={mockOnImagesChange} onUrlsChange={mockOnUrlsChange} />);

      // Find and click the first remove button
      const removeButtons = screen.getAllByRole('button').filter(
        (button) => button.querySelector('svg') // Look for buttons with X icon
      );

      fireEvent.click(removeButtons[0]);

      // Verify that onImagesChange was called with the updated array
      expect(mockOnImagesChange).toHaveBeenCalledWith([]);

      // Verify that onUrlsChange was called with functional updater
      expect(mockOnUrlsChange).toHaveBeenCalledWith(expect.any(Function));

      // Verify the functional updater removes the correct item
      const functionalUpdater = mockOnUrlsChange.mock.calls[0][0];
      const result = functionalUpdater(['http://test.com/img1.jpg', 'http://test.com/img2.jpg']);
      expect(result).toEqual(['http://test.com/img2.jpg']);
    });

    it('should handle removing image from middle of array', () => {
      const mockOnImagesChange = jest.fn();
      const mockOnUrlsChange = jest.fn();
      const testFile1 = new File(['test1'], 'test1.jpg', { type: 'image/jpeg' });
      const testFile2 = new File(['test2'], 'test2.jpg', { type: 'image/jpeg' });
      const testFile3 = new File(['test3'], 'test3.jpg', { type: 'image/jpeg' });

      render(
        <ImageUpload
          uploadedImages={[testFile1, testFile2, testFile3]}
          imageUrls={['http://test.com/img1.jpg', 'http://test.com/img2.jpg', 'http://test.com/img3.jpg']}
          onImagesChange={mockOnImagesChange}
          onUrlsChange={mockOnUrlsChange}
        />
      );

      // Find and click the second remove button (index 1)
      const removeButtons = screen.getAllByRole('button').filter((button) => button.querySelector('svg'));

      fireEvent.click(removeButtons[1]);

      // Verify that onImagesChange was called with the updated array
      expect(mockOnImagesChange).toHaveBeenCalledWith([testFile1, testFile3]);

      // Verify the functional updater removes the correct item
      const functionalUpdater = mockOnUrlsChange.mock.calls[0][0];
      const result = functionalUpdater(['http://test.com/img1.jpg', 'http://test.com/img2.jpg', 'http://test.com/img3.jpg']);
      expect(result).toEqual(['http://test.com/img1.jpg', 'http://test.com/img3.jpg']);
    });
  });

  describe('5. Edge cases and filtering', () => {
    it('should filter out non-image files', () => {
      const mockOnImagesChange = jest.fn();
      const mockOnUrlsChange = jest.fn();

      render(<ImageUpload {...mockProps} onImagesChange={mockOnImagesChange} onUrlsChange={mockOnUrlsChange} />);

      const fileInput = screen.getByLabelText(/click to select images/i) as HTMLInputElement;
      const imageFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const textFile = new File(['test'], 'test.txt', { type: 'text/plain' });

      fireEvent.change(fileInput, {
        target: {
          files: [imageFile, textFile],
        },
      });

      // Should only process the image file
      expect(mockOnImagesChange).toHaveBeenCalledWith([imageFile]);
    });

    it('should filter out duplicate files', () => {
      const mockOnImagesChange = jest.fn();
      const mockOnUrlsChange = jest.fn();
      const existingFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      render(<ImageUpload uploadedImages={[existingFile]} imageUrls={['http://test.com/existing.jpg']} onImagesChange={mockOnImagesChange} onUrlsChange={mockOnUrlsChange} />);

      const fileInput = screen.getByLabelText(/click to select images/i) as HTMLInputElement;
      const newFile = new File(['test2'], 'test2.jpg', { type: 'image/jpeg' });
      const duplicateFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' }); // Same name as existing

      fireEvent.change(fileInput, {
        target: {
          files: [newFile, duplicateFile],
        },
      });

      // Should only add the new file, not the duplicate
      expect(mockOnImagesChange).toHaveBeenCalledWith([existingFile, newFile]);
    });

    it('should handle empty file selection', () => {
      const mockOnImagesChange = jest.fn();
      const mockOnUrlsChange = jest.fn();

      render(<ImageUpload {...mockProps} onImagesChange={mockOnImagesChange} onUrlsChange={mockOnUrlsChange} />);

      const fileInput = screen.getByLabelText(/click to select images/i) as HTMLInputElement;

      fireEvent.change(fileInput, {
        target: {
          files: [],
        },
      });

      // Should call onImagesChange with empty array for empty selection
      expect(mockOnImagesChange).toHaveBeenCalledWith([]);
      expect(mockOnUrlsChange).not.toHaveBeenCalled();
    });

    it('should handle null/undefined files in event target', () => {
      const mockOnImagesChange = jest.fn();
      const mockOnUrlsChange = jest.fn();

      render(<ImageUpload {...mockProps} onImagesChange={mockOnImagesChange} onUrlsChange={mockOnUrlsChange} />);

      const fileInput = screen.getByLabelText(/click to select images/i) as HTMLInputElement;

      // Simulate event with null files
      fireEvent.change(fileInput, {
        target: {
          files: null,
        },
      });

      // Should call onImagesChange with empty array when files is null
      expect(mockOnImagesChange).toHaveBeenCalledWith([]);
      expect(mockOnUrlsChange).not.toHaveBeenCalled();
    });

    it('should handle undefined files in event target', () => {
      const mockOnImagesChange = jest.fn();
      const mockOnUrlsChange = jest.fn();

      render(<ImageUpload {...mockProps} onImagesChange={mockOnImagesChange} onUrlsChange={mockOnUrlsChange} />);

      const fileInput = screen.getByLabelText(/click to select images/i) as HTMLInputElement;

      // Simulate event with undefined files
      fireEvent.change(fileInput, {
        target: {
          files: undefined,
        },
      });

      // Should call onImagesChange with empty array when files is undefined
      expect(mockOnImagesChange).toHaveBeenCalledWith([]);
      expect(mockOnUrlsChange).not.toHaveBeenCalled();
    });
  });

  describe('6. FileReader edge cases', () => {
    it('should handle FileReader with null result', async () => {
      const mockOnImagesChange = jest.fn();
      const mockOnUrlsChange = jest.fn();

      // Set NODE_ENV to test
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'test',
        writable: true,
      });

      // Mock fetch to reject
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      // Mock FileReader with null result
      const mockFileReader = {
        readAsDataURL: jest.fn(),
        onload: null as any,
      };
      const originalFileReader = global.FileReader;
      (global.FileReader as any) = jest.fn().mockImplementation(() => {
        setTimeout(() => {
          if (mockFileReader.onload) {
            mockFileReader.onload({ target: { result: null } }); // Null result
          }
        }, 0);
        return mockFileReader;
      });

      render(<ImageUpload {...mockProps} onImagesChange={mockOnImagesChange} onUrlsChange={mockOnUrlsChange} />);

      const fileInput = screen.getByLabelText(/click to select images/i) as HTMLInputElement;
      const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      fireEvent.change(fileInput, {
        target: {
          files: [testFile],
        },
      });

      // Wait for FileReader to complete
      await waitFor(() => {
        // Should not call onUrlsChange because result is null
        expect(mockOnUrlsChange).not.toHaveBeenCalled();
      });

      // Restore FileReader
      global.FileReader = originalFileReader;
    });

    it('should handle FileReader with empty string result', async () => {
      const mockOnImagesChange = jest.fn();
      const mockOnUrlsChange = jest.fn();

      // Set NODE_ENV to test
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'test',
        writable: true,
      });

      // Mock fetch to reject
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      // Mock FileReader with empty string result
      const mockFileReader = {
        readAsDataURL: jest.fn(),
        onload: null as any,
      };
      const originalFileReader = global.FileReader;
      (global.FileReader as any) = jest.fn().mockImplementation(() => {
        setTimeout(() => {
          if (mockFileReader.onload) {
            mockFileReader.onload({ target: { result: '' } }); // Empty string result
          }
        }, 0);
        return mockFileReader;
      });

      render(<ImageUpload {...mockProps} onImagesChange={mockOnImagesChange} onUrlsChange={mockOnUrlsChange} />);

      const fileInput = screen.getByLabelText(/click to select images/i) as HTMLInputElement;
      const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      fireEvent.change(fileInput, {
        target: {
          files: [testFile],
        },
      });

      // Wait for FileReader to complete
      await waitFor(() => {
        // Should not call onUrlsChange because result is empty string
        expect(mockOnUrlsChange).not.toHaveBeenCalled();
      });

      // Restore FileReader
      global.FileReader = originalFileReader;
    });

    it('should handle FileReader with undefined target', async () => {
      const mockOnImagesChange = jest.fn();
      const mockOnUrlsChange = jest.fn();

      // Set NODE_ENV to test
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'test',
        writable: true,
      });

      // Mock fetch to reject
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      // Mock FileReader with undefined target
      const mockFileReader = {
        readAsDataURL: jest.fn(),
        onload: null as any,
      };
      const originalFileReader = global.FileReader;
      (global.FileReader as any) = jest.fn().mockImplementation(() => {
        setTimeout(() => {
          if (mockFileReader.onload) {
            mockFileReader.onload({ target: undefined }); // Undefined target
          }
        }, 0);
        return mockFileReader;
      });

      render(<ImageUpload {...mockProps} onImagesChange={mockOnImagesChange} onUrlsChange={mockOnUrlsChange} />);

      const fileInput = screen.getByLabelText(/click to select images/i) as HTMLInputElement;
      const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      fireEvent.change(fileInput, {
        target: {
          files: [testFile],
        },
      });

      // Wait for FileReader to complete
      await waitFor(() => {
        // Should not call onUrlsChange because target is undefined
        expect(mockOnUrlsChange).not.toHaveBeenCalled();
      });

      // Restore FileReader
      global.FileReader = originalFileReader;
    });

    it('should handle FileReader with missing onload handler', async () => {
      const mockOnImagesChange = jest.fn();
      const mockOnUrlsChange = jest.fn();

      // Set NODE_ENV to test
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'test',
        writable: true,
      });

      // Mock fetch to reject
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      // Mock FileReader without onload handler
      const mockFileReader = {
        readAsDataURL: jest.fn(),
        onload: null as any,
      };
      const originalFileReader = global.FileReader;
      (global.FileReader as any) = jest.fn().mockImplementation(() => {
        // Don't set onload handler, so it remains null
        return mockFileReader;
      });

      render(<ImageUpload {...mockProps} onImagesChange={mockOnImagesChange} onUrlsChange={mockOnUrlsChange} />);

      const fileInput = screen.getByLabelText(/click to select images/i) as HTMLInputElement;
      const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      fireEvent.change(fileInput, {
        target: {
          files: [testFile],
        },
      });

      // Wait for FileReader to complete
      await waitFor(() => {
        // Should not call onUrlsChange because onload is null
        expect(mockOnUrlsChange).not.toHaveBeenCalled();
      });

      // Restore FileReader
      global.FileReader = originalFileReader;
    });
  });

  describe('7. Component rendering and UI states', () => {
    it('should render uploaded images section when imageUrls has content', () => {
      const mockOnImagesChange = jest.fn();
      const mockOnUrlsChange = jest.fn();
      const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      render(<ImageUpload uploadedImages={[testFile]} imageUrls={['http://test.com/img1.jpg']} onImagesChange={mockOnImagesChange} onUrlsChange={mockOnUrlsChange} />);

      // Verify uploaded images section is displayed
      expect(screen.getByText('Uploaded Images (1)')).toBeInTheDocument();
      expect(screen.getByTestId('next-image')).toBeInTheDocument();
    });

    it('should not render uploaded images section when imageUrls is empty', () => {
      const mockOnImagesChange = jest.fn();
      const mockOnUrlsChange = jest.fn();

      render(<ImageUpload {...mockProps} onImagesChange={mockOnImagesChange} onUrlsChange={mockOnUrlsChange} />);

      // Verify uploaded images section is not displayed
      expect(screen.queryByText(/Uploaded Images/)).not.toBeInTheDocument();
    });

    it('should display fallback image name when uploadedImages[index] is undefined', () => {
      const mockOnImagesChange = jest.fn();
      const mockOnUrlsChange = jest.fn();

      render(
        <ImageUpload
          uploadedImages={[]} // Empty array, so uploadedImages[0] will be undefined
          imageUrls={['http://test.com/img1.jpg']}
          onImagesChange={mockOnImagesChange}
          onUrlsChange={mockOnUrlsChange}
        />
      );

      // Verify fallback text is displayed
      expect(screen.getByText('Image 1')).toBeInTheDocument();
    });

    it('should display actual file name when uploadedImages[index] exists', () => {
      const mockOnImagesChange = jest.fn();
      const mockOnUrlsChange = jest.fn();
      const testFile = new File(['test'], 'actual-filename.jpg', { type: 'image/jpeg' });

      render(<ImageUpload uploadedImages={[testFile]} imageUrls={['http://test.com/img1.jpg']} onImagesChange={mockOnImagesChange} onUrlsChange={mockOnUrlsChange} />);

      // Verify actual filename is displayed
      expect(screen.getByText('actual-filename.jpg')).toBeInTheDocument();
    });
  });

  describe('8. Direct function testing', () => {
    it('should test uploadToCloudinary function directly', async () => {
      const mockOnImagesChange = jest.fn();
      const mockOnUrlsChange = jest.fn();

      // Mock fetch to return successful response
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({
          secure_url: 'http://test.com/direct-test.jpg',
        }),
      });

      const { container } = render(<ImageUpload {...mockProps} onImagesChange={mockOnImagesChange} onUrlsChange={mockOnUrlsChange} />);

      // Access the component instance to test uploadToCloudinary directly
      const component = container.firstChild as any;

      // Since we can't directly access the function, we'll test it through the file upload flow
      // but with a more comprehensive test that ensures all code paths are executed
      const fileInput = screen.getByLabelText(/click to select images/i) as HTMLInputElement;
      const testFile = new File(['test'], 'direct-test.jpg', { type: 'image/jpeg' });

      fireEvent.change(fileInput, {
        target: {
          files: [testFile],
        },
      });

      // Wait for the upload to complete
      await waitFor(() => {
        expect(mockOnUrlsChange).toHaveBeenCalledWith(expect.any(Function));
      });

      // Verify the functional updater was called correctly
      const functionalUpdater = mockOnUrlsChange.mock.calls[0][0];
      const result = functionalUpdater([]);
      expect(result).toEqual(['http://test.com/direct-test.jpg']);
    });

    it('should test uploadToCloudinary function with json parsing error', async () => {
      const mockOnImagesChange = jest.fn();
      const mockOnUrlsChange = jest.fn();

      // Mock fetch to return error response with json that throws
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: jest.fn().mockRejectedValue(new Error('JSON parse error')),
      });

      render(<ImageUpload {...mockProps} onImagesChange={mockOnImagesChange} onUrlsChange={mockOnUrlsChange} />);

      const fileInput = screen.getByLabelText(/click to select images/i) as HTMLInputElement;
      const testFile = new File(['test'], 'json-error-test.jpg', { type: 'image/jpeg' });

      fireEvent.change(fileInput, {
        target: {
          files: [testFile],
        },
      });

      // Wait for error to be logged
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error uploading image:', expect.any(Error));
      });

      // Verify the generic error message is used when json parsing fails
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error uploading image:',
        expect.objectContaining({
          message: 'Failed to upload image to Cloudinary',
        })
      );
    });
  });
});
