import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ImageUpload } from '../../../../../src/components/admin/add-hotel/ImageUpload';

const mockProps = {
  uploadedImages: [],
  imageUrls: [],
  onImagesChange: jest.fn(),
  onUrlsChange: jest.fn(),
};

describe('ImageUpload-simple - Part 1', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('renders correctly', () => {
    render(<ImageUpload {...mockProps} />);

    expect(screen.getByText('Hotel Images')).toBeInTheDocument();
    expect(screen.getByText('Click to select images')).toBeInTheDocument();
    expect(screen.getByText('Choose multiple files')).toBeInTheDocument();
  });

  it('handles file selection and FileReader test condition', async () => {
    const mockOnImagesChange = jest.fn();
    const mockOnUrlsChange = jest.fn();

    // Set NODE_ENV to test to trigger FileReader fallback
    const originalEnv = process.env.NODE_ENV;
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'test',
      writable: true,
    });

    // Mock fetch to simulate Cloudinary upload failure (which triggers test fallback)
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

    render(<ImageUpload {...mockProps} onImagesChange={mockOnImagesChange} onUrlsChange={mockOnUrlsChange} />);

    const fileInput = document.querySelector('#image-upload') as HTMLInputElement;
    const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    // Mock FileReader
    const originalFileReader = global.FileReader;
    const mockFileReader = {
      readAsDataURL: jest.fn(),
      onload: null as any,
    };
    global.FileReader = jest.fn().mockImplementation(() => {
      setTimeout(() => {
        if (mockFileReader.onload) {
          mockFileReader.onload({ target: { result: 'data:image/jpeg;base64,test' } });
        }
      }, 0);
      return mockFileReader;
    });

    fireEvent.change(fileInput, {
      target: {
        files: [testFile],
      },
    });

    expect(mockOnImagesChange).toHaveBeenCalledWith([testFile]);

    await waitFor(() => {
      expect(mockOnUrlsChange).toHaveBeenCalledWith(expect.any(Function));
    });

    // Restore FileReader and NODE_ENV
    global.FileReader = originalFileReader;
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: originalEnv,
      writable: true,
    });
  });

  it('filters non-image files', async () => {
    const mockOnImagesChange = jest.fn();
    const mockOnUrlsChange = jest.fn();

    render(<ImageUpload {...mockProps} onImagesChange={mockOnImagesChange} onUrlsChange={mockOnUrlsChange} />);

    const fileInput = document.querySelector('#image-upload') as HTMLInputElement;
    const textFile = new File(['test'], 'test.txt', { type: 'text/plain' });
    const imageFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    fireEvent.change(fileInput, {
      target: {
        files: [textFile, imageFile],
      },
    });

    // Should only include the image file
    expect(mockOnImagesChange).toHaveBeenCalledWith([imageFile]);
  });

  it('filters duplicate files', async () => {
    const existingFile = new File(['existing'], 'existing.jpg', { type: 'image/jpeg' });
    const newFile = new File(['new'], 'new.jpg', { type: 'image/jpeg' });
    const duplicateFile = new File(['duplicate'], 'existing.jpg', { type: 'image/jpeg' });

    const mockOnImagesChange = jest.fn();
    const mockOnUrlsChange = jest.fn();

    render(<ImageUpload {...mockProps} uploadedImages={[existingFile]} onImagesChange={mockOnImagesChange} onUrlsChange={mockOnUrlsChange} />);

    const fileInput = document.querySelector('#image-upload') as HTMLInputElement;

    fireEvent.change(fileInput, {
      target: {
        files: [duplicateFile, newFile],
      },
    });

    // Should only include the new file, not the duplicate
    expect(mockOnImagesChange).toHaveBeenCalledWith([existingFile, newFile]);
  });
});
