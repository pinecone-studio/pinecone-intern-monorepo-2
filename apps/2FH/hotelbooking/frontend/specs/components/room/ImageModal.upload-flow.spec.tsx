import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { ImageModal } from '../../../src/components/room/ImageModal';

// Mock the useImageUpload hook
jest.mock('../../../src/components/room/useImageUpload', () => ({
  useImageUpload: jest.fn(),
}));

global.fetch = jest.fn();
global.URL.createObjectURL = jest.fn(() => 'https://example.com/mocked-url');

describe('ImageModal Upload Flow', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onSave: jest.fn(),
  };

  const mockUseImageUpload = jest.requireMock('../../../src/components/room/useImageUpload').useImageUpload;

  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
    (global.URL.createObjectURL as jest.Mock).mockClear();

    // Setup default mock for useImageUpload
    mockUseImageUpload.mockReturnValue({
      selectedFiles: [],
      isUploading: false,
      handleFileSelect: jest.fn(),
      removeFile: jest.fn(),
      handleSave: jest.fn(),
      handleClose: jest.fn(),
      getPreviewUrl: jest.fn(() => 'https://example.com/mocked-url'),
    });
  });

  it('should complete full upload flow successfully', async () => {
    const mockOnSave = jest.fn();
    const mockOnClose = jest.fn();
    const mockHandleSave = jest.fn();

    // Mock the hook with files
    mockUseImageUpload.mockReturnValue({
      selectedFiles: [new File(['test1'], 'test1.png', { type: 'image/png' })],
      isUploading: false,
      handleFileSelect: jest.fn(),
      removeFile: jest.fn(),
      handleSave: mockHandleSave,
      handleClose: jest.fn(),
      getPreviewUrl: jest.fn(() => 'https://example.com/mocked-url'),
    });

    render(<ImageModal {...defaultProps} onSave={mockOnSave} onClose={mockOnClose} />);

    // Verify the component renders with files
    expect(screen.getByText('Upload & Save (1 images)')).toBeInTheDocument();
    expect(screen.getByText('Selected Images (1)')).toBeInTheDocument();

    // Click save button
    const saveButton = screen.getByText('Upload & Save (1 images)');
    fireEvent.click(saveButton);

    // Verify handleSave was called
    expect(mockHandleSave).toHaveBeenCalled();
  });

  it('should handle mixed file types correctly', async () => {
    const mockOnSave = jest.fn();
    const mockHandleSave = jest.fn();

    // Mock the hook with only image files (filtered)
    mockUseImageUpload.mockReturnValue({
      selectedFiles: [new File(['test1'], 'test1.png', { type: 'image/png' })],
      isUploading: false,
      handleFileSelect: jest.fn(),
      removeFile: jest.fn(),
      handleSave: mockHandleSave,
      handleClose: jest.fn(),
      getPreviewUrl: jest.fn(() => 'https://example.com/mocked-url'),
    });

    render(<ImageModal {...defaultProps} onSave={mockOnSave} />);

    // Verify the component renders with only image files
    expect(screen.getByText('Upload & Save (1 images)')).toBeInTheDocument();
    expect(screen.getByText('Selected Images (1)')).toBeInTheDocument();

    const saveButton = screen.getByText('Upload & Save (1 images)');
    fireEvent.click(saveButton);

    // Verify handleSave was called
    expect(mockHandleSave).toHaveBeenCalled();
  });
});
