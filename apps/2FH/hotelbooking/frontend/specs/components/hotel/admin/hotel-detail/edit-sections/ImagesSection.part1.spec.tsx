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
describe('ImagesSection - Part 1', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('renders the component with title and description', () => {
    render(<ImagesSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);
    expect(screen.getByText('Hotel Images')).toBeInTheDocument();
    expect(screen.getByText('Upload images from your computer or phone')).toBeInTheDocument();
  });
  it('displays current images when available', () => {
    render(<ImagesSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);
    expect(screen.getByText('Current Images')).toBeInTheDocument();
    expect(screen.getAllByTestId('next-image')).toHaveLength(2);
  });
  it('does not display current images section when no images', () => {
    const emptyFormData = { images: [] };
    render(<ImagesSection formData={emptyFormData} handleInputChange={mockHandleInputChange} />);
    expect(screen.queryByText('Current Images')).not.toBeInTheDocument();
  });
  it('renders drag drop area', () => {
    render(<ImagesSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);
    expect(screen.getByText('Drop images here or click to upload')).toBeInTheDocument();
    expect(screen.getByText('Choose Files')).toBeInTheDocument();
    expect(screen.getByText('Supports JPG, PNG, GIF up to 10MB each')).toBeInTheDocument();
  });
  it('handles drag enter event', () => {
    render(<ImagesSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);
    const dragArea = screen.getByText('Drop images here or click to upload').closest('div');
    fireEvent.dragEnter(dragArea!);
    expect(screen.getByText('Drop images here or click to upload')).toBeInTheDocument();
  });
  it('handles drag leave event', () => {
    render(<ImagesSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);
    const dragArea = screen.getByText('Drop images here or click to upload').closest('div');
    fireEvent.dragEnter(dragArea!);
    fireEvent.dragLeave(dragArea!);
    expect(screen.getByText('Drop images here or click to upload')).toBeInTheDocument();
  });
  it('handles drag over event', () => {
    render(<ImagesSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);
    const dragArea = screen.getByText('Drop images here or click to upload').closest('div');
    fireEvent.dragOver(dragArea!);
    expect(screen.getByText('Drop images here or click to upload')).toBeInTheDocument();
  });
  it('handles file drop event', async () => {
    const mockFile = new File(['mock'], 'test.jpg', { type: 'image/jpeg' });
    const mockFileList = [mockFile];
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
    const dragArea = screen.getByText('Drop images here or click to upload').closest('div');
    fireEvent.drop(dragArea!, {
      dataTransfer: {
        files: mockFileList,
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
  it('handles file input change', async () => {
    const mockFile = new File(['mock'], 'test.jpg', { type: 'image/jpeg' });
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
        files: [mockFile],
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
  it('removes image when remove button is clicked', () => {
    render(<ImagesSection formData={mockFormData} handleInputChange={mockHandleInputChange} />);

    const removeButtons = screen.getAllByText('Remove');
    fireEvent.click(removeButtons[0]);

    expect(mockHandleInputChange).toHaveBeenCalledWith('images', ['https://example.com/image2.jpg']);
  });
});
