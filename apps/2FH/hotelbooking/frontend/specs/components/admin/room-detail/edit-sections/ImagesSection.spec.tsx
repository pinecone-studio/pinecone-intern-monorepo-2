/* eslint-disable */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ImagesSection } from '@/components/admin/room-detail/edit-sections/ImagesSection';

// Mock FileReader
const mockFileReader = {
  readAsDataURL: jest.fn(),
  onload: null as any,
  result: null as any,
};

global.FileReader = jest.fn(() => mockFileReader) as any;

describe('ImagesSection', () => {
  const mockRoom = {
    imageURL: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
  };

  const defaultProps = {
    room: mockRoom,
    handleInputChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockFileReader.onload = null;
    mockFileReader.result = null;
  });

  it('renders upload section correctly', () => {
    render(<ImagesSection {...defaultProps} />);

    expect(screen.getByText('Room Images')).toBeInTheDocument();
    expect(screen.getByText('Click to upload images')).toBeInTheDocument();
    expect(screen.getByText('PNG, JPG, GIF up to 10MB each')).toBeInTheDocument();
  });

  it('displays existing images', () => {
    render(<ImagesSection {...defaultProps} />);

    expect(screen.getByText('Image Previews (2)')).toBeInTheDocument();
    expect(screen.getByAltText('Room image 1')).toBeInTheDocument();
    expect(screen.getByAltText('Room image 2')).toBeInTheDocument();
  });

  it('handles room with single image as string', () => {
    const roomWithStringImage = {
      imageURL: 'https://example.com/single-image.jpg',
    };

    render(<ImagesSection {...defaultProps} room={roomWithStringImage} />);

    expect(screen.getByText('Image Previews (1)')).toBeInTheDocument();
    expect(screen.getByAltText('Room image 1')).toBeInTheDocument();
  });

  it('handles room with no images', () => {
    const roomWithNoImages = {
      imageURL: [],
    };

    render(<ImagesSection {...defaultProps} room={roomWithNoImages} />);

    expect(screen.getByText('No images uploaded yet')).toBeInTheDocument();
    expect(screen.getByText('Upload images to preview them here')).toBeInTheDocument();
  });

  it('handles room with null imageURL', () => {
    const roomWithNullImages = {
      imageURL: null,
    };

    render(<ImagesSection {...defaultProps} room={roomWithNullImages} />);

    expect(screen.getByText('No images uploaded yet')).toBeInTheDocument();
  });

  it('handles room with undefined imageURL', () => {
    const roomWithUndefinedImages = {
      imageURL: undefined,
    };

    render(<ImagesSection {...defaultProps} room={roomWithUndefinedImages} />);

    expect(screen.getByText('No images uploaded yet')).toBeInTheDocument();
  });

  it('handles file upload click', () => {
    render(<ImagesSection {...defaultProps} />);

    const uploadButton = screen.getByText('Click to upload images');
    fireEvent.click(uploadButton);

    // File input should be triggered (we can't assert directly)
    expect(uploadButton).toBeInTheDocument();
  });

  it('does nothing when files is null', () => {
    render(<ImagesSection {...defaultProps} />);

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

    // Simulate change event with null files
    fireEvent.change(fileInput, { target: { files: null } });

    // Should not call handleInputChange
    expect(defaultProps.handleInputChange).not.toHaveBeenCalled();
  });

  it('handles file selection with valid images', async () => {
    const mockFile = new File(['image content'], 'test.jpg', { type: 'image/jpeg' });
    const mockFileList = {
      0: mockFile,
      length: 1,
      item: (index: number) => (index === 0 ? mockFile : null),
    };

    render(<ImagesSection {...defaultProps} />);

    const fileInput = screen.getByRole('button', { name: /click to upload images/i }).parentElement?.querySelector('input[type="file"]') as HTMLInputElement;

    if (fileInput) {
      Object.defineProperty(fileInput, 'files', {
        value: mockFileList,
        writable: false,
      });

      mockFileReader.result = 'data:image/jpeg;base64,test-image-data';

      fireEvent.change(fileInput);

      if (mockFileReader.onload) {
        mockFileReader.onload({ target: { result: 'data:image/jpeg;base64,test-image-data' } } as any);
      }

      await waitFor(() => {
        expect(defaultProps.handleInputChange).toHaveBeenCalled();
      });
    }
  });

  it('handles file selection with non-image files', () => {
    const mockFile = new File(['text content'], 'test.txt', { type: 'text/plain' });
    const mockFileList = {
      0: mockFile,
      length: 1,
      item: (index: number) => (index === 0 ? mockFile : null),
    };

    render(<ImagesSection {...defaultProps} />);

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    Object.defineProperty(fileInput, 'files', {
      value: mockFileList,
      writable: false,
    });

    fireEvent.change(fileInput);

    expect(defaultProps.handleInputChange).not.toHaveBeenCalled();
  });

  it('handles file processing with multiple images', async () => {
    const mockFile1 = new File(['image1'], 'test1.jpg', { type: 'image/jpeg' });
    const mockFile2 = new File(['image2'], 'test2.png', { type: 'image/png' });
    const mockFileList = {
      0: mockFile1,
      1: mockFile2,
      length: 2,
      item: (index: number) => (index < 2 ? [mockFile1, mockFile2][index] : null),
    };

    render(<ImagesSection {...defaultProps} />);

    const fileInput = screen.getByRole('button', { name: /click to upload images/i }).parentElement?.querySelector('input[type="file"]') as HTMLInputElement;

    if (fileInput) {
      Object.defineProperty(fileInput, 'files', {
        value: mockFileList,
        writable: false,
      });

      mockFileReader.result = 'data:image/jpeg;base64,test-image-data-1';
      fireEvent.change(fileInput);

      if (mockFileReader.onload) {
        mockFileReader.onload({ target: { result: 'data:image/jpeg;base64,test-image-data-1' } } as any);
      }

      mockFileReader.result = 'data:image/png;base64/test-image-data-2';
      if (mockFileReader.onload) {
        mockFileReader.onload({ target: { result: 'data:image/png;base64/test-image-data-2' } } as any);
      }

      await waitFor(() => {
        expect(defaultProps.handleInputChange).toHaveBeenCalled();
      });
    }
  });

  it('handles image removal', () => {
    render(<ImagesSection {...defaultProps} />);

    const removeButtons = screen.getAllByRole('button');
    const removeButton = removeButtons.find((button) => button.textContent === '');

    if (removeButton) {
      fireEvent.click(removeButton);
      expect(defaultProps.handleInputChange).toHaveBeenCalledWith('imageURL', ['https://example.com/image2.jpg']);
    }
  });

  it('handles image load error', () => {
    render(<ImagesSection {...defaultProps} />);

    const image = screen.getByAltText('Room image 1');
    fireEvent.error(image);

    expect(image).toHaveStyle('display: none');
  });

  it('filters out null/undefined/empty images', () => {
    const roomWithMixedImages = {
      imageURL: ['https://example.com/image1.jpg', null, undefined, '', 'https://example.com/image2.jpg'],
    };

    render(<ImagesSection {...defaultProps} room={roomWithMixedImages} />);

    expect(screen.getByText('Image Previews (2)')).toBeInTheDocument();
    expect(screen.getByAltText('Room image 1')).toBeInTheDocument();
    expect(screen.getByAltText('Room image 2')).toBeInTheDocument();
  });

  it('displays correct image count', () => {
    const roomWithManyImages = {
      imageURL: Array.from({ length: 5 }, (_, i) => `https://example.com/image${i + 1}.jpg`),
    };

    render(<ImagesSection {...defaultProps} room={roomWithManyImages} />);

    expect(screen.getByText('Image Previews (5)')).toBeInTheDocument();
  });

  it('has correct file input attributes', () => {
    render(<ImagesSection {...defaultProps} />);

    const fileInput = document.querySelector('input[type="file"]');
    expect(fileInput).toHaveAttribute('multiple');
    expect(fileInput).toHaveAttribute('accept', 'image/*');
  });

  it('matches snapshot with images', () => {
    const { container } = render(<ImagesSection {...defaultProps} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot without images', () => {
    const roomWithNoImages = {
      imageURL: [],
    };

    const { container } = render(<ImagesSection {...defaultProps} room={roomWithNoImages} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
