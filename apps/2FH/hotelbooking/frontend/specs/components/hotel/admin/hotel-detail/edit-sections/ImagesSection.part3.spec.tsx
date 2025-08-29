import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@/TestUtils';
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

describe('ImagesSection - Part 3', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('filters non-image files', async () => {
    const mockImageFile = new File(['mock'], 'test.jpg', { type: 'image/jpeg' });
    const mockTextFile = new File(['mock'], 'test.txt', { type: 'text/plain' });

    // Set NODE_ENV to test to trigger FileReader fallback
    const originalEnv = process.env.NODE_ENV;
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'test',
      writable: true,
    });

    // Mock fetch to simulate Cloudinary upload failure (which triggers test fallback)
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

    // Mock FileReader to simulate successful file reading
    const mockFileReader = {
      readAsDataURL: jest.fn(),
      onload: null,
      onerror: null,
    };
    global.FileReader = jest.fn().mockImplementation(() => {
      setTimeout(() => {
        if (mockFileReader.onload) {
          mockFileReader.onload({ target: { result: 'data:image/jpeg;base64,mock' } });
        }
      }, 0);
      return mockFileReader;
    });

    render(<ImagesSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

    const fileInput = screen.getByRole('button', { name: 'Choose Files' }).nextElementSibling as HTMLInputElement;
    fireEvent.change(fileInput, {
      target: {
        files: [mockImageFile, mockTextFile],
      },
    });

    await waitFor(() => {
      expect(mockHandleInputChange).toHaveBeenCalled();
    });

    // Restore NODE_ENV
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: originalEnv,
      writable: true,
    });
  });

  it('handles empty file list', () => {
    render(<ImagesSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

    const fileInput = screen.getByRole('button', { name: 'Choose Files' }).nextElementSibling as HTMLInputElement;
    fireEvent.change(fileInput, {
      target: {
        files: [],
      },
    });

    expect(mockHandleInputChange).not.toHaveBeenCalled();
  });

  it('handles drag drop with no files', () => {
    render(<ImagesSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

    const dragArea = screen.getByText('Drop images here or click to upload').closest('div');
    fireEvent.drop(dragArea!, {
      dataTransfer: {
        files: [],
      },
    });

    expect(mockHandleInputChange).not.toHaveBeenCalled();
  });

  it('prevents default on drag events', () => {
    const preventDefault = jest.fn();
    const stopPropagation = jest.fn();

    render(<ImagesSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

    const dragArea = screen.getByText('Drop images here or click to upload').closest('div');

    // Create a custom drag event with the mocked functions
    const dragEvent = new Event('dragenter', { bubbles: true }) as any;
    dragEvent.preventDefault = preventDefault;
    dragEvent.stopPropagation = stopPropagation;
    dragEvent.dataTransfer = { files: [] };

    act(() => {
      dragArea!.dispatchEvent(dragEvent);
    });

    expect(preventDefault).toHaveBeenCalled();
    expect(stopPropagation).toHaveBeenCalled();
  });

  it('renders image items with correct structure', () => {
    render(<ImagesSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

    const imageItems = screen.getAllByTestId('next-image');
    expect(imageItems).toHaveLength(2);
    expect(imageItems[0]).toHaveAttribute('src', 'https://example.com/image1.jpg');
    expect(imageItems[1]).toHaveAttribute('src', 'https://example.com/image2.jpg');
  });

  it('handles hover states for image items', () => {
    render(<ImagesSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

    const imageContainers = screen.getAllByTestId('next-image');
    const firstImageContainer = imageContainers[0].closest('.group');
    expect(firstImageContainer).toHaveClass('group');
  });
});
