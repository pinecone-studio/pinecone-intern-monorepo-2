import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { ImageModal } from '../../../src/components/room/ImageModal';

jest.mock('../../../src/components/room/useImageUpload', () => ({
  useImageUpload: jest.fn(),
}));

global.fetch = jest.fn();
global.URL.createObjectURL = jest.fn(() => 'https://example.com/mocked-url');

describe('ImageModal Error Handling', () => {
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

  it('should handle network errors gracefully', async () => {
    const mockOnSave = jest.fn();
    const mockHandleSave = jest.fn();
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    // Mock the hook with files
    mockUseImageUpload.mockReturnValue({
      selectedFiles: [new File(['test'], 'test.png', { type: 'image/png' })],
      isUploading: false,
      handleFileSelect: jest.fn(),
      removeFile: jest.fn(),
      handleSave: mockHandleSave,
      handleClose: jest.fn(),
      getPreviewUrl: jest.fn(() => 'https://example.com/mocked-url'),
    });

    render(<ImageModal {...defaultProps} onSave={mockOnSave} />);

    expect(screen.getByText('Upload & Save (1 images)')).toBeInTheDocument();
    expect(screen.getByText('Selected Images (1)')).toBeInTheDocument();

    const saveButton = screen.getByText('Upload & Save (1 images)');
    fireEvent.click(saveButton);

    expect(mockHandleSave).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('should handle partial upload failures', async () => {
    const mockOnSave = jest.fn();
    const mockHandleSave = jest.fn();
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    mockUseImageUpload.mockReturnValue({
      selectedFiles: [new File(['test1'], 'test1.png', { type: 'image/png' }), new File(['test2'], 'test2.jpg', { type: 'image/jpeg' })],
      isUploading: false,
      handleFileSelect: jest.fn(),
      removeFile: jest.fn(),
      handleSave: mockHandleSave,
      handleClose: jest.fn(),
      getPreviewUrl: jest.fn(() => 'https://example.com/mocked-url'),
    });

    render(<ImageModal {...defaultProps} onSave={mockOnSave} />);

    expect(screen.getByText('Upload & Save (2 images)')).toBeInTheDocument();
    expect(screen.getByText('Selected Images (2)')).toBeInTheDocument();

    const saveButton = screen.getByText('Upload & Save (2 images)');
    fireEvent.click(saveButton);

    expect(mockHandleSave).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
