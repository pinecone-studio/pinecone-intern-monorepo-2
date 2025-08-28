import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ImageModal } from '../../../src/components/room/ImageModal';

global.fetch = jest.fn();
global.URL.createObjectURL = jest.fn(() => 'https://example.com/mocked-url');

describe('ImageModal Removal & Actions', () => {
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

  describe('File Removal', () => {
    it('should remove image when remove button is clicked', async () => {
      const mockOnSave = jest.fn();
      render(<ImageModal {...defaultProps} onSave={mockOnSave} />);
      const file = new File(['test'], 'test.png', { type: 'image/png' });
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (input) {
        Object.defineProperty(input, 'files', { value: [file] });
        fireEvent.change(input);
      }
      await waitFor(() => {
        expect(screen.getByText('Upload & Save (1 images)')).toBeInTheDocument();
      });
      const removeButton = screen.getByRole('button', { name: /remove image/i });
      fireEvent.click(removeButton);
      await waitFor(() => {
        expect(screen.getByText('Upload & Save (0 images)')).toBeInTheDocument();
        expect(screen.queryByText('Selected Images (1)')).not.toBeInTheDocument();
      });
    });

    it('should remove specific image by index', async () => {
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
      });
      const removeButtons = screen.getAllByRole('button', { name: /remove image/i });
      fireEvent.click(removeButtons[0]);
      await waitFor(() => {
        expect(screen.getByText('Upload & Save (1 images)')).toBeInTheDocument();
        expect(screen.getByText('Selected Images (1)')).toBeInTheDocument();
      });
    });
  });

  describe('Modal Actions', () => {
    it('should call onClose when cancel button is clicked', () => {
      const mockOnClose = jest.fn();
      render(<ImageModal {...defaultProps} onClose={mockOnClose} />);
      const closeButton = screen.getByText('Cancel');
      fireEvent.click(closeButton);
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should call onClose when X button is clicked', () => {
      const mockOnClose = jest.fn();
      render(<ImageModal {...defaultProps} onClose={mockOnClose} />);
      const closeButton = screen.getByRole('button', { name: '' });
      fireEvent.click(closeButton);
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should reset selected files when modal is closed', async () => {
      const mockOnClose = jest.fn();
      render(<ImageModal {...defaultProps} onClose={mockOnClose} />);
      const file = new File(['test'], 'test.png', { type: 'image/png' });
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (input) {
        Object.defineProperty(input, 'files', { value: [file] });
        fireEvent.change(input);
      }
      await waitFor(() => {
        expect(screen.getByText('Upload & Save (1 images)')).toBeInTheDocument();
      });
      const closeButton = screen.getByText('Cancel');
      fireEvent.click(closeButton);
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});
