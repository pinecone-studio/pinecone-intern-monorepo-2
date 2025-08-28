import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ImageModal } from '../../../src/components/room/ImageModal';

global.fetch = jest.fn();
global.URL.createObjectURL = jest.fn(() => 'https://example.com/mocked-url');

describe('ImageModal State Management & Performance', () => {
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

  it('should reset state when modal is closed and reopened', async () => {
    const mockOnClose = jest.fn();
    const { rerender } = render(<ImageModal {...defaultProps} onClose={mockOnClose} />);

    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (input) {
      Object.defineProperty(input, 'files', {
        value: [file],
      });
      fireEvent.change(input);
    }

    await waitFor(() => {
      expect(screen.getByText('Upload & Save (1 images)')).toBeInTheDocument();
    });

    const closeButton = screen.getByText('Cancel');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();

    rerender(<ImageModal {...defaultProps} isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByText('Upload & Save (0 images)')).toBeInTheDocument();
    expect(screen.queryByText('Selected Images (1)')).not.toBeInTheDocument();
  });

  it('should handle large number of files', async () => {
    const mockOnSave = jest.fn();
    render(<ImageModal {...defaultProps} onSave={mockOnSave} />);

    const files = Array.from({ length: 10 }, (_, i) => new File([`test${i}`], `test${i}.png`, { type: 'image/png' }));

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (input) {
      Object.defineProperty(input, 'files', {
        value: files,
      });
      fireEvent.change(input);
    }

    await waitFor(() => {
      expect(screen.getByText('Upload & Save (10 images)')).toBeInTheDocument();
      expect(screen.getByText('Selected Images (10)')).toBeInTheDocument();
    });

    const removeButtons = screen.getAllByRole('button', { name: /remove image/i });
    expect(removeButtons).toHaveLength(10);
  });

  it('should handle files with special characters in names', async () => {
    const mockOnSave = jest.fn();
    render(<ImageModal {...defaultProps} onSave={mockOnSave} />);

    const file = new File(['test'], 'test-image-2024@#$%.png', { type: 'image/png' });

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (input) {
      Object.defineProperty(input, 'files', {
        value: [file],
      });
      fireEvent.change(input);
    }

    await waitFor(() => {
      expect(screen.getByText('Upload & Save (1 images)')).toBeInTheDocument();
      expect(screen.getByText('Selected Images (1)')).toBeInTheDocument();
    });
  });

  it('should handle empty file content', async () => {
    const mockOnSave = jest.fn();
    render(<ImageModal {...defaultProps} onSave={mockOnSave} />);

    const file = new File([], 'empty.png', { type: 'image/png' });

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (input) {
      Object.defineProperty(input, 'files', {
        value: [file],
      });
      fireEvent.change(input);
    }

    await waitFor(() => {
      expect(screen.getByText('Upload & Save (1 images)')).toBeInTheDocument();
      expect(screen.getByText('Selected Images (1)')).toBeInTheDocument();
    });
  });
});
