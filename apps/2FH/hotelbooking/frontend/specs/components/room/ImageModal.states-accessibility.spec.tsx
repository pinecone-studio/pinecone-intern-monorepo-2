import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ImageModal } from '../../../src/components/room/ImageModal';

global.fetch = jest.fn();
global.URL.createObjectURL = jest.fn(() => 'https://example.com/mocked-url');

describe('ImageModal States & Accessibility', () => {
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

  describe('Button States', () => {
    it('should disable save button when no files selected', () => {
      render(<ImageModal {...defaultProps} />);
      const saveButton = screen.getByRole('button', { name: /upload & save \(0 images\)/i });
      expect(saveButton).toBeDisabled();
    });

    it('should enable save button when files are selected', async () => {
      render(<ImageModal {...defaultProps} />);
      const file = new File(['test'], 'test.png', { type: 'image/png' });
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (input) {
        Object.defineProperty(input, 'files', { value: [file] });
        fireEvent.change(input);
      }
      await waitFor(() => {
        const saveButton = screen.getByRole('button', { name: /upload & save \(1 images\)/i });
        expect(saveButton).not.toBeDisabled();
      });
    });

    it('should disable buttons during upload', async () => {
      render(<ImageModal {...defaultProps} />);
      const mockResponse = {
        ok: true,
        json: async () => ({ secureUrl: 'https://example.com/image1.jpg' }),
      };
      (global.fetch as jest.Mock).mockImplementationOnce(() => new Promise((resolve) => setTimeout(() => resolve(mockResponse), 100)));
      const file = new File(['test'], 'test.png', { type: 'image/png' });
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (input) {
        Object.defineProperty(input, 'files', { value: [file] });
        fireEvent.change(input);
      }
      await waitFor(() => {
        const saveButton = screen.getByText('Upload & Save (1 images)');
        fireEvent.click(saveButton);
      });
      expect(screen.getByRole('button', { name: /uploading/i })).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', async () => {
      render(<ImageModal {...defaultProps} />);
      const removeButtons = screen.queryAllByRole('button', { name: /remove image/i });
      expect(removeButtons).toHaveLength(0);
      const file = new File(['test'], 'test.png', { type: 'image/png' });
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (input) {
        Object.defineProperty(input, 'files', { value: [file] });
        fireEvent.change(input);
      }
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /remove image/i })).toBeInTheDocument();
      });
    });

    it('should have proper alt text for images', async () => {
      render(<ImageModal {...defaultProps} />);
      const file = new File(['test'], 'test.png', { type: 'image/png' });
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (input) {
        Object.defineProperty(input, 'files', { value: [file] });
        fireEvent.change(input);
      }
      await waitFor(() => {
        const image = screen.getByAltText('Preview 1');
        expect(image).toBeInTheDocument();
      });
    });
  });
});
