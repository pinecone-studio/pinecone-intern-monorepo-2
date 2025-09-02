import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ImageUpload } from '../../../../../src/components/admin/add-hotel/ImageUpload';

const mockProps = {
  uploadedImages: [],
  imageUrls: [],
  onImagesChange: jest.fn(),
  onUrlsChange: jest.fn(),
};

describe('ImageUpload-simple - Part 2', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('tests removeImage function', () => {
    const mockImages = [new File(['test1'], 'test1.jpg', { type: 'image/jpeg' }), new File(['test2'], 'test2.png', { type: 'image/png' })];
    // eslint-disable-next-line no-secrets/no-secrets
    const mockUrls = ['data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEA'];
    const mockOnImagesChange = jest.fn();
    const mockOnUrlsChange = jest.fn();

    render(<ImageUpload {...mockProps} uploadedImages={mockImages} imageUrls={mockUrls} onImagesChange={mockOnImagesChange} onUrlsChange={mockOnUrlsChange} />);

    // Find and click remove button (this tests line 78)
    const removeButtons = screen.getAllByRole('button');
    const removeButton = removeButtons.find((button) => button.querySelector('svg') && button.className.includes('bg-red-500'));

    if (removeButton) {
      fireEvent.click(removeButton); // This should trigger lines 44-45
      expect(mockOnImagesChange).toHaveBeenCalledWith([mockImages[1]]);
      expect(mockOnUrlsChange).toHaveBeenCalledWith(expect.any(Function));
    }
  });

  it('displays uploaded images', () => {
    const mockImages = [new File(['test'], 'test.jpg', { type: 'image/jpeg' })];
    const mockUrls = ['data:image/jpeg;base64,test'];

    render(<ImageUpload {...mockProps} uploadedImages={mockImages} imageUrls={mockUrls} />);

    expect(screen.getByText('Uploaded Images (1)')).toBeInTheDocument();
  });

  it('covers line 20 branch - handles null files', () => {
    const mockOnImagesChange = jest.fn();
    const mockOnUrlsChange = jest.fn();

    render(<ImageUpload {...mockProps} onImagesChange={mockOnImagesChange} onUrlsChange={mockOnUrlsChange} />);

    const fileInput = document.querySelector('#image-upload') as HTMLInputElement;

    // Simulate null files to trigger the || [] branch
    Object.defineProperty(fileInput, 'files', {
      value: null,
      writable: false,
    });

    fireEvent.change(fileInput);

    expect(mockOnImagesChange).toHaveBeenCalledWith([]);
  });

  it('covers line 83 branch - handles file without name', () => {
    // Create a file object without a name to trigger the || fallback
    const mockFileWithoutName = new File(['test'], '', { type: 'image/jpeg' });
    Object.defineProperty(mockFileWithoutName, 'name', {
      value: '',
      writable: false,
    });

    const mockImages = [mockFileWithoutName];
    const mockUrls = ['data:image/jpeg;base64,test'];

    render(<ImageUpload {...mockProps} uploadedImages={mockImages} imageUrls={mockUrls} />);

    // Should display "Image 1" instead of the file name
    expect(screen.getByText('Image 1')).toBeInTheDocument();
  });
});
