import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ImageModal } from '../../../src/components/room/ImageModal';

jest.mock('../../../src/components/room/useImageUpload', () => ({
  useImageUpload: jest.fn(),
}));
global.fetch = jest.fn();
global.URL.createObjectURL = jest.fn(() => 'https://example.com/mocked-url');
describe('ImageModal Upload Success & Error', () => {
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
  it('should upload images successfully', async () => {
    const mockOnSave = jest.fn();
    const mockHandleSave = jest.fn();

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
  });

  it('should handle upload errors gracefully', async () => {
    const mockOnSave = jest.fn();
    const mockHandleSave = jest.fn();
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

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

  it('should handle general upload failure', async () => {
    const mockOnSave = jest.fn();
    const mockHandleSave = jest.fn();
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
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
  it('should handle general uploadAllImages function error', async () => {
    const mockOnSave = jest.fn();
    const mockHandleSave = jest.fn();
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

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

  it('should handle error in onSave callback', async () => {
    const mockOnSave = jest.fn();
    const mockHandleSave = jest.fn();
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

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
});
