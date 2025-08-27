import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ImageModal } from '../../../src/components/room/ImageModal';

global.fetch = jest.fn();
global.URL.createObjectURL = jest.fn(() => 'https://example.com/mocked-url');

describe('ImageModal Rendering & File Selection', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onSave: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
    (global.URL.createObjectURL as jest.Mock).mockClear();
  });

  describe('Rendering', () => {
    it('should render when open', () => {
      render(<ImageModal {...defaultProps} />);
      expect(screen.getByText('Upload Room Images')).toBeInTheDocument();
      expect(screen.getByText('Click to upload or drag and drop')).toBeInTheDocument();
      expect(screen.getByText('PNG, JPG, GIF up to 10MB each')).toBeInTheDocument();
    });

    it('should not render when closed', () => {
      render(<ImageModal {...defaultProps} isOpen={false} />);
      expect(screen.queryByText('Upload Room Images')).not.toBeInTheDocument();
    });

    it('should have file input with correct attributes', () => {
      render(<ImageModal {...defaultProps} />);
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      expect(fileInput).toBeInTheDocument();
      expect(fileInput).toHaveAttribute('multiple');
      expect(fileInput).toHaveAttribute('accept', 'image/*');
      expect(fileInput).toHaveClass('hidden');
    });

    it('should display correct button text when no files selected', () => {
      render(<ImageModal {...defaultProps} />);
      expect(screen.getByText('Upload & Save (0 images)')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });
  });

  describe('File Selection', () => {
    it('should handle file selection via click', async () => {
      const mockOnSave = jest.fn();
      render(<ImageModal {...defaultProps} onSave={mockOnSave} />);
      const file = new File(['test'], 'test.png', { type: 'image/png' });
      const uploadArea = screen.getByText('Click to upload or drag and drop').closest('div');
      if (uploadArea) {
        fireEvent.click(uploadArea);
      }
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (input) {
        Object.defineProperty(input, 'files', { value: [file] });
        fireEvent.change(input);
      }
      await waitFor(() => {
        expect(screen.getByText('Upload & Save (1 images)')).toBeInTheDocument();
        expect(screen.getByText('Selected Images (1)')).toBeInTheDocument();
      });
    });

    it('should handle drag and drop', async () => {
      const mockOnSave = jest.fn();
      render(<ImageModal {...defaultProps} onSave={mockOnSave} />);
      const uploadArea = screen.getByText('Click to upload or drag and drop').closest('div');
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      if (uploadArea) {
        fireEvent.dragOver(uploadArea);
        fireEvent.drop(uploadArea, { dataTransfer: { files: [file] } });
      }
      await waitFor(() => {
        expect(screen.getByText('Upload & Save (1 images)')).toBeInTheDocument();
        expect(screen.getByText('Selected Images (1)')).toBeInTheDocument();
      });
    });

    it('should filter non-image files', async () => {
      const mockOnSave = jest.fn();
      render(<ImageModal {...defaultProps} onSave={mockOnSave} />);
      const imageFile = new File(['test'], 'test.png', { type: 'image/png' });
      const textFile = new File(['test'], 'test.txt', { type: 'text/plain' });
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (input) {
        Object.defineProperty(input, 'files', { value: [imageFile, textFile] });
        fireEvent.change(input);
      }
      await waitFor(() => {
        expect(screen.getByText('Upload & Save (1 images)')).toBeInTheDocument();
        expect(screen.getByText('Selected Images (1)')).toBeInTheDocument();
      });
    });

    it('should handle multiple image files', async () => {
      const mockOnSave = jest.fn();
      render(<ImageModal {...defaultProps} onSave={mockOnSave} />);
      const file1 = new File(['test1'], 'test1.png', { type: 'image/png' });
      const file2 = new File(['test2'], 'test2.jpg', { type: 'image/jpeg' });
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (input) {
        Object.defineProperty(input, 'files', { value: [file1, file2] });
        fireEvent.change(input);
      }
      await waitFor(() => {
        expect(screen.getByText('Upload & Save (2 images)')).toBeInTheDocument();
        expect(screen.getByText('Selected Images (2)')).toBeInTheDocument();
      });
    });

    it('should handle null files', () => {
      const mockOnSave = jest.fn();
      render(<ImageModal {...defaultProps} onSave={mockOnSave} />);
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (input) {
        Object.defineProperty(input, 'files', { value: null });
        fireEvent.change(input);
      }
      expect(screen.getByText('Upload & Save (0 images)')).toBeInTheDocument();
    });

    it('should handle empty file list', () => {
      const mockOnSave = jest.fn();
      render(<ImageModal {...defaultProps} onSave={mockOnSave} />);
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (input) {
        Object.defineProperty(input, 'files', { value: [] });
        fireEvent.change(input);
      }
      expect(screen.getByText('Upload & Save (0 images)')).toBeInTheDocument();
    });
  });
});
