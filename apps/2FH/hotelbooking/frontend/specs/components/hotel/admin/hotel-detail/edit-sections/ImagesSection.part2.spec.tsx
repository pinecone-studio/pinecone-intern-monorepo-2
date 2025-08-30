import React from 'react';
import { render, screen, fireEvent, waitFor } from '@/TestUtils';
import { ImagesSection } from '@/components/admin/hotel-detail/edit-sections/ImagesSection';

jest.mock('next/image', () => {
  const MockImage = ({ src, alt, _fill, className }: any) => {
    return <img src={src} alt={alt} className={className} data-testid="next-image" />;
  };
  MockImage.displayName = 'MockImage';
  return MockImage;
});

const mockFormData = {
  images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
};

const mockHandleInputChange = jest.fn();

describe('ImagesSection - Part 2', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('handles multiple image removal', () => {
    render(<ImagesSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

    const removeButtons = screen.getAllByText('Remove');
    fireEvent.click(removeButtons[0]);
    fireEvent.click(removeButtons[1]);

    expect(mockHandleInputChange).toHaveBeenCalledTimes(2);
    expect(mockHandleInputChange).toHaveBeenNthCalledWith(1, 'images', ['https://example.com/image2.jpg']);
    expect(mockHandleInputChange).toHaveBeenNthCalledWith(2, 'images', ['https://example.com/image1.jpg']);
  });

  it('shows loading state during upload', async () => {
    const mockFile = new File(['mock'], 'test.jpg', { type: 'image/jpeg' });

    render(<ImagesSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

    const fileInput = screen.getByRole('button', { name: 'Choose Files' }).nextElementSibling as HTMLInputElement;
    fireEvent.change(fileInput, {
      target: {
        files: [mockFile],
      },
    });

    await waitFor(() => {
      expect(screen.getByText('Processing images...')).toBeInTheDocument();
    });
  });

  it('handles file reader error', async () => {
    const mockFile = new File(['mock'], 'test.jpg', { type: 'image/jpeg' });

    // Mock FileReader to simulate error
    const mockFileReader = {
      readAsDataURL: jest.fn(),
      onload: null,
      onerror: null,
    };
    global.FileReader = jest.fn().mockImplementation(() => mockFileReader);

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {
      // Mock implementation
    });

    render(<ImagesSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

    const fileInput = screen.getByRole('button', { name: 'Choose Files' }).nextElementSibling as HTMLInputElement;
    fireEvent.change(fileInput, {
      target: {
        files: [mockFile],
      },
    });

    // Simulate FileReader error
    if (mockFileReader.onerror) {
      mockFileReader.onerror(new Error('File read error'));
    }

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });
});
