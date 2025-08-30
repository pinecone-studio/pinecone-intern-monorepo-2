/* eslint-disable  */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@/TestUtils';
import { ImagesSection } from '@/components/admin/hotel-detail/edit-sections/ImagesSection';

// Mock next/image
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} data-testid="next-image" {...props} />;
  };
});

// No need to mock DragDropArea - we'll work with the actual component

describe('ImagesSection - Comprehensive Error Tests', () => {
  const mockProps = {
    formData: {
      images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
    },
    handleInputChange: jest.fn(),
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

  describe('1. Error branch - fetch returns { ok: false }', () => {
    it('should throw error when Cloudinary returns non-ok response', async () => {
      const mockHandleInputChange = jest.fn();

      // Mock fetch to return non-ok response
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: jest.fn().mockResolvedValue({}),
      });

      render(<ImagesSection {...mockProps} handleInputChange={mockHandleInputChange} />);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      fireEvent.change(fileInput, {
        target: {
          files: [testFile],
        },
      });

      // Wait for the error to be logged
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error uploading to Cloudinary:', expect.any(Error));
      });

      // Verify the error message
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error uploading to Cloudinary:',
        expect.objectContaining({
          message: 'Failed to upload image to Cloudinary',
        })
      );
    });

    it('should throw error when Cloudinary returns error with specific message', async () => {
      const mockHandleInputChange = jest.fn();

      // Mock fetch to return non-ok response with error data
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 413,
        statusText: 'Payload Too Large',
        json: jest.fn().mockResolvedValue({
          error: {
            message: 'File too large',
          },
        }),
      });

      render(<ImagesSection {...mockProps} handleInputChange={mockHandleInputChange} />);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      fireEvent.change(fileInput, {
        target: {
          files: [testFile],
        },
      });

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Error uploading to Cloudinary:',
          expect.objectContaining({
            message: 'File too large',
          })
        );
      });
    });
  });

  describe('2. Catch block - fetch rejects', () => {
    it('should handle fetch rejection and log error', async () => {
      const mockHandleInputChange = jest.fn();

      // Mock fetch to reject
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      render(<ImagesSection {...mockProps} handleInputChange={mockHandleInputChange} />);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      fireEvent.change(fileInput, {
        target: {
          files: [testFile],
        },
      });

      // Wait for the error to be logged
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error uploading to Cloudinary:', expect.any(Error));
      });

      // Verify the error message
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error uploading to Cloudinary:',
        expect.objectContaining({
          message: 'Network error',
        })
      );
    });

    it('should handle fetch rejection with specific error message', async () => {
      const mockHandleInputChange = jest.fn();

      // Mock fetch to reject with specific error
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Connection timeout'));

      render(<ImagesSection {...mockProps} handleInputChange={mockHandleInputChange} />);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      fireEvent.change(fileInput, {
        target: {
          files: [testFile],
        },
      });

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Error uploading to Cloudinary:',
          expect.objectContaining({
            message: 'Connection timeout',
          })
        );
      });
    });
  });

  describe('3. Outer catch block in handleFiles', () => {
    it('should log "Error uploading images:" when upload fails and FileReader also fails', async () => {
      const mockHandleInputChange = jest.fn();

      // Set NODE_ENV to test
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'test',
        writable: true,
      });

      // Mock fetch to reject
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Upload failed'));

      // Mock FileReader to also fail
      const mockFileReader = {
        readAsDataURL: jest.fn(),
        onload: null as any,
        onerror: null as any,
      };
      const originalFileReader = global.FileReader;
      (global.FileReader as any) = jest.fn().mockImplementation(() => {
        setTimeout(() => {
          if (mockFileReader.onerror) {
            mockFileReader.onerror(new Error('FileReader failed'));
          }
        }, 0);
        return mockFileReader;
      });

      render(<ImagesSection {...mockProps} handleInputChange={mockHandleInputChange} />);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      fireEvent.change(fileInput, {
        target: {
          files: [testFile],
        },
      });

      // Wait for both error logs
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error uploading to Cloudinary:', expect.any(Error));
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error uploading images:', expect.any(Error));
      });

      // Verify the outer catch block was triggered
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error uploading images:',
        expect.objectContaining({
          message: 'FileReader failed',
        })
      );

      // Restore FileReader
      global.FileReader = originalFileReader;
    });

    it('should handle multiple file upload failures', async () => {
      const mockHandleInputChange = jest.fn();

      // Set NODE_ENV to test
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'test',
        writable: true,
      });

      // Mock fetch to reject for all files
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Multiple upload failures'));

      // Mock FileReader to also fail
      const mockFileReader = {
        readAsDataURL: jest.fn(),
        onload: null as any,
        onerror: null as any,
      };
      const originalFileReader = global.FileReader;
      (global.FileReader as any) = jest.fn().mockImplementation(() => {
        setTimeout(() => {
          if (mockFileReader.onerror) {
            mockFileReader.onerror(new Error('FileReader failed'));
          }
        }, 0);
        return mockFileReader;
      });

      render(<ImagesSection {...mockProps} handleInputChange={mockHandleInputChange} />);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      const testFile1 = new File(['test1'], 'test1.jpg', { type: 'image/jpeg' });
      const testFile2 = new File(['test2'], 'test2.jpg', { type: 'image/jpeg' });

      fireEvent.change(fileInput, {
        target: {
          files: [testFile1, testFile2],
        },
      });

      // Wait for error logs
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error uploading images:', expect.any(Error));
      });

      // Should have multiple error logs (one for each file + outer catch)
      const errorCalls = consoleErrorSpy.mock.calls.filter((call) => call[0] === 'Error uploading to Cloudinary:' || call[0] === 'Error uploading images:');
      expect(errorCalls.length).toBeGreaterThan(1);

      // Restore FileReader
      global.FileReader = originalFileReader;
    });
  });

  describe('4. Successful Cloudinary upload', () => {
    it('should successfully upload image to Cloudinary and return secure_url', async () => {
      const mockHandleInputChange = jest.fn();

      // Mock fetch to return successful response
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({
          secure_url: 'https://res.cloudinary.com/dxjdxefkk/image/upload/v1234567890/test-image.jpg',
        }),
      });

      render(<ImagesSection {...mockProps} handleInputChange={mockHandleInputChange} />);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      fireEvent.change(fileInput, {
        target: {
          files: [testFile],
        },
      });

      // Wait for handleInputChange to be called with the Cloudinary URL
      await waitFor(() => {
        expect(mockHandleInputChange).toHaveBeenCalledWith(
          'images',
          expect.arrayContaining(['https://example.com/image1.jpg', 'https://example.com/image2.jpg', 'https://res.cloudinary.com/dxjdxefkk/image/upload/v1234567890/test-image.jpg'])
        );
      });
    });

    it('should handle multiple successful uploads', async () => {
      const mockHandleInputChange = jest.fn();

      // Mock fetch to return successful responses for multiple files
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({
          secure_url: 'https://res.cloudinary.com/dxjdxefkk/image/upload/v1234567890/multiple-test.jpg',
        }),
      });

      render(<ImagesSection {...mockProps} handleInputChange={mockHandleInputChange} />);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      const testFile1 = new File(['test1'], 'test1.jpg', { type: 'image/jpeg' });
      const testFile2 = new File(['test2'], 'test2.jpg', { type: 'image/jpeg' });

      fireEvent.change(fileInput, {
        target: {
          files: [testFile1, testFile2],
        },
      });

      // Wait for handleInputChange to be called with both Cloudinary URLs
      await waitFor(() => {
        expect(mockHandleInputChange).toHaveBeenCalledWith(
          'images',
          expect.arrayContaining([
            'https://example.com/image1.jpg',
            'https://example.com/image2.jpg',
            'https://res.cloudinary.com/dxjdxefkk/image/upload/v1234567890/multiple-test.jpg',
            'https://res.cloudinary.com/dxjdxefkk/image/upload/v1234567890/multiple-test.jpg',
          ])
        );
      });
    });

    it('should handle successful drag and drop upload', async () => {
      const mockHandleInputChange = jest.fn();

      // Mock fetch to return successful response
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({
          secure_url: 'https://res.cloudinary.com/dxjdxefkk/image/upload/v1234567890/drag-drop-success.jpg',
        }),
      });

      render(<ImagesSection {...mockProps} handleInputChange={mockHandleInputChange} />);

      // Trigger drag and drop
      const dragArea = screen.getByText('Drop images here or click to upload').closest('div');
      const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      fireEvent.drop(dragArea!, {
        dataTransfer: {
          files: [testFile],
        },
      });

      // Wait for handleInputChange to be called with the Cloudinary URL
      await waitFor(() => {
        expect(mockHandleInputChange).toHaveBeenCalledWith(
          'images',
          expect.arrayContaining(['https://example.com/image1.jpg', 'https://example.com/image2.jpg', 'https://res.cloudinary.com/dxjdxefkk/image/upload/v1234567890/drag-drop-success.jpg'])
        );
      });
    });
  });

  describe('5. Test environment fallback with FileReader', () => {
    it('should fallback to FileReader when NODE_ENV is test and upload fails', async () => {
      const mockHandleInputChange = jest.fn();

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
        onerror: null as any,
      };
      const originalFileReader = global.FileReader;
      (global.FileReader as any) = jest.fn().mockImplementation(() => {
        // Simulate the async nature of FileReader
        setTimeout(() => {
          if (mockFileReader.onload) {
            mockFileReader.onload({ target: { result: 'data:image/jpeg;base64,fake-base64-string' } });
          }
        }, 0);
        return mockFileReader;
      });

      render(<ImagesSection {...mockProps} handleInputChange={mockHandleInputChange} />);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      fireEvent.change(fileInput, {
        target: {
          files: [testFile],
        },
      });

      // Wait for handleInputChange to be called with the base64 string
      await waitFor(() => {
        expect(mockHandleInputChange).toHaveBeenCalledWith(
          'images',
          expect.arrayContaining(['https://example.com/image1.jpg', 'https://example.com/image2.jpg', 'data:image/jpeg;base64,fake-base64-string'])
        );
      });

      // Restore FileReader
      global.FileReader = originalFileReader;
    });

    it('should not fallback to FileReader when NODE_ENV is not test', async () => {
      const mockHandleInputChange = jest.fn();

      // Set NODE_ENV to production
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'production',
        writable: true,
      });

      // Mock fetch to reject
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      render(<ImagesSection {...mockProps} handleInputChange={mockHandleInputChange} />);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      fireEvent.change(fileInput, {
        target: {
          files: [testFile],
        },
      });

      // Wait for error to be logged
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error uploading to Cloudinary:', expect.any(Error));
      });

      // handleInputChange should not be called since there's no fallback in production
      expect(mockHandleInputChange).not.toHaveBeenCalled();
    });

    it('should handle FileReader error in test environment', async () => {
      const mockHandleInputChange = jest.fn();

      // Set NODE_ENV to test
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'test',
        writable: true,
      });

      // Mock fetch to reject
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      // Mock FileReader with error
      const mockFileReader = {
        readAsDataURL: jest.fn(),
        onload: null as any,
        onerror: null as any,
      };
      const originalFileReader = global.FileReader;
      (global.FileReader as any) = jest.fn().mockImplementation(() => {
        // Simulate FileReader error
        setTimeout(() => {
          if (mockFileReader.onerror) {
            mockFileReader.onerror(new Error('FileReader error'));
          }
        }, 0);
        return mockFileReader;
      });

      render(<ImagesSection {...mockProps} handleInputChange={mockHandleInputChange} />);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      fireEvent.change(fileInput, {
        target: {
          files: [testFile],
        },
      });

      // Wait for error to be logged
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error uploading to Cloudinary:', expect.any(Error));
      });

      // Restore FileReader
      global.FileReader = originalFileReader;
    });
  });

  describe('6. Drag and drop functionality', () => {
    it('should handle drag and drop with upload failure', async () => {
      const mockHandleInputChange = jest.fn();

      // Mock fetch to reject
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Drag drop upload failed'));

      render(<ImagesSection {...mockProps} handleInputChange={mockHandleInputChange} />);

      // Trigger drag and drop by simulating a drop event
      const dragArea = screen.getByText('Drop images here or click to upload').closest('div');
      const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      fireEvent.drop(dragArea!, {
        dataTransfer: {
          files: [testFile],
        },
      });

      // Wait for error to be logged
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error uploading to Cloudinary:', expect.any(Error));
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error uploading to Cloudinary:',
        expect.objectContaining({
          message: 'Drag drop upload failed',
        })
      );
    });

    it('should handle drag and drop with test environment fallback', async () => {
      const mockHandleInputChange = jest.fn();

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
            mockFileReader.onload({ target: { result: 'data:image/jpeg;base64,drag-drop-fallback' } });
          }
        }, 0);
        return mockFileReader;
      });

      render(<ImagesSection {...mockProps} handleInputChange={mockHandleInputChange} />);

      // Trigger drag and drop
      const dragArea = screen.getByText('Drop images here or click to upload').closest('div');
      const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      fireEvent.drop(dragArea!, {
        dataTransfer: {
          files: [testFile],
        },
      });

      // Wait for handleInputChange to be called with the base64 string
      await waitFor(() => {
        expect(mockHandleInputChange).toHaveBeenCalledWith(
          'images',
          expect.arrayContaining(['https://example.com/image1.jpg', 'https://example.com/image2.jpg', 'data:image/jpeg;base64,drag-drop-fallback'])
        );
      });

      // Restore FileReader
      global.FileReader = originalFileReader;
    });
  });

  describe('7. Edge cases and error handling', () => {
    it('should handle empty file list', () => {
      const mockHandleInputChange = jest.fn();

      render(<ImagesSection {...mockProps} handleInputChange={mockHandleInputChange} />);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      fireEvent.change(fileInput, {
        target: {
          files: [],
        },
      });

      expect(mockHandleInputChange).not.toHaveBeenCalled();
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('should filter out non-image files', () => {
      const mockHandleInputChange = jest.fn();

      render(<ImagesSection {...mockProps} handleInputChange={mockHandleInputChange} />);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      const imageFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const textFile = new File(['test'], 'test.txt', { type: 'text/plain' });

      fireEvent.change(fileInput, {
        target: {
          files: [imageFile, textFile],
        },
      });

      // Should only process the image file
      expect(mockHandleInputChange).not.toHaveBeenCalled(); // Because upload will fail, but we're testing filtering
    });

    it('should handle multiple files with mixed success/failure', async () => {
      const mockHandleInputChange = jest.fn();

      // Set NODE_ENV to test
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'test',
        writable: true,
      });

      // Mock fetch to reject for all files
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Mixed upload failures'));

      // Mock FileReader to succeed for both files
      const originalFileReader = global.FileReader;
      (global.FileReader as any) = jest.fn().mockImplementation(() => {
        const mockReader = {
          readAsDataURL: jest.fn(),
          onload: null as any,
        };

        // Simulate async FileReader behavior
        setTimeout(() => {
          if (mockReader.onload) {
            mockReader.onload({ target: { result: 'data:image/jpeg;base64,multiple-files' } });
          }
        }, 10);

        return mockReader;
      });

      render(<ImagesSection {...mockProps} handleInputChange={mockHandleInputChange} />);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      const testFile1 = new File(['test1'], 'test1.jpg', { type: 'image/jpeg' });
      const testFile2 = new File(['test2'], 'test2.jpg', { type: 'image/jpeg' });

      fireEvent.change(fileInput, {
        target: {
          files: [testFile1, testFile2],
        },
      });

      // Wait for handleInputChange to be called once with both files
      await waitFor(
        () => {
          expect(mockHandleInputChange).toHaveBeenCalledTimes(1);
          expect(mockHandleInputChange).toHaveBeenCalledWith(
            'images',
            expect.arrayContaining(['https://example.com/image1.jpg', 'https://example.com/image2.jpg', 'data:image/jpeg;base64,multiple-files', 'data:image/jpeg;base64,multiple-files'])
          );
        },
        { timeout: 3000 }
      );

      // Restore FileReader
      global.FileReader = originalFileReader;
    });
  });

  describe('8. Component functionality', () => {
    it('should remove image when remove button is clicked', () => {
      const mockHandleInputChange = jest.fn();

      render(<ImagesSection {...mockProps} handleInputChange={mockHandleInputChange} />);

      // Find and click the first remove button
      const removeButtons = screen.getAllByText('Remove');
      fireEvent.click(removeButtons[0]);

      // Verify that handleInputChange was called with the updated images array
      expect(mockHandleInputChange).toHaveBeenCalledWith('images', ['https://example.com/image2.jpg']);
    });

    it('should display current images when available', () => {
      const mockHandleInputChange = jest.fn();

      render(<ImagesSection {...mockProps} handleInputChange={mockHandleInputChange} />);

      // Verify that current images are displayed
      expect(screen.getByText('Current Images')).toBeInTheDocument();
      expect(screen.getAllByTestId('next-image')).toHaveLength(2);
    });

    it('should not display current images section when no images', () => {
      const mockHandleInputChange = jest.fn();
      const emptyFormData = { images: [] };

      render(<ImagesSection formData={emptyFormData} handleInputChange={mockHandleInputChange} />);

      // Verify that current images section is not displayed
      expect(screen.queryByText('Current Images')).not.toBeInTheDocument();
    });

    it('should display loading state when uploading', async () => {
      const mockHandleInputChange = jest.fn();

      // Mock fetch to delay response
      (global.fetch as jest.Mock).mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: () => Promise.resolve({ secure_url: 'https://example.com/test.jpg' }),
                }),
              100
            )
          )
      );

      render(<ImagesSection {...mockProps} handleInputChange={mockHandleInputChange} />);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      fireEvent.change(fileInput, {
        target: {
          files: [testFile],
        },
      });

      // Verify loading state is displayed
      expect(screen.getByText('Processing images...')).toBeInTheDocument();
      expect(screen.getAllByText('Uploading...')).toHaveLength(2);
    });

    it('should handle drag drop with no files', () => {
      const mockHandleInputChange = jest.fn();

      render(<ImagesSection {...mockProps} handleInputChange={mockHandleInputChange} />);

      // Trigger drag and drop with no files
      const dragArea = screen.getByText('Drop images here or click to upload').closest('div');

      fireEvent.drop(dragArea!, {
        dataTransfer: {
          files: [],
        },
      });

      // Verify that handleInputChange was not called
      expect(mockHandleInputChange).not.toHaveBeenCalled();
    });

    it('should handle file input with no files', () => {
      const mockHandleInputChange = jest.fn();

      render(<ImagesSection {...mockProps} handleInputChange={mockHandleInputChange} />);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      fireEvent.change(fileInput, {
        target: {
          files: [],
        },
      });

      // Verify that handleInputChange was not called
      expect(mockHandleInputChange).not.toHaveBeenCalled();
    });

    it('should handle response.json() throwing an error in uploadToCloudinary', async () => {
      const mockHandleInputChange = jest.fn();

      // Mock fetch to return error response where json() throws
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: jest.fn().mockRejectedValue(new Error('JSON parse error')),
      });

      render(<ImagesSection {...mockProps} handleInputChange={mockHandleInputChange} />);

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      fireEvent.change(fileInput, {
        target: {
          files: [testFile],
        },
      });

      // Wait for error to be logged
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error uploading to Cloudinary:', expect.any(Error));
      });

      // Verify the generic error message is used when response.json() throws
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error uploading to Cloudinary:',
        expect.objectContaining({
          message: 'Failed to upload image to Cloudinary',
        })
      );
    });
  });
});
