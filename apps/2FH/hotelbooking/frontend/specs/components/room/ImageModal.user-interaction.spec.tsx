import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ImageModal } from '../../../src/components/room/ImageModal';

global.fetch = jest.fn();
global.URL.createObjectURL = jest.fn(() => 'https://example.com/mocked-url');

describe('ImageModal User Interaction', () => {
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

  it('should handle file removal correctly', async () => {
    const mockOnSave = jest.fn();
    render(<ImageModal {...defaultProps} onSave={mockOnSave} />);

    const file1 = new File(['test1'], 'test1.png', { type: 'image/png' });
    const file2 = new File(['test2'], 'test2.jpg', { type: 'image/jpeg' });

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (input) {
      Object.defineProperty(input, 'files', {
        value: [file1, file2],
      });
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

    const remainingRemoveButtons = screen.getAllByRole('button', { name: /remove image/i });
    fireEvent.click(remainingRemoveButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Upload & Save (0 images)')).toBeInTheDocument();
      expect(screen.queryByText('Selected Images (1)')).not.toBeInTheDocument();
    });
  });

  it('should handle modal close during upload', async () => {
    const mockOnSave = jest.fn();
    const mockOnClose = jest.fn();
    render(<ImageModal {...defaultProps} onSave={mockOnSave} onClose={mockOnClose} />);

    (global.fetch as jest.Mock).mockImplementationOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: async () => ({ secureUrl: 'https://example.com/image1.jpg' }),
              }),
            100
          )
        )
    );

    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (input) {
      Object.defineProperty(input, 'files', {
        value: [file],
      });
      fireEvent.change(input);
    }

    await waitFor(() => {
      const saveButton = screen.getByText('Upload & Save (1 images)');
      fireEvent.click(saveButton);
    });

    const closeButton = screen.getByText('Cancel');
    fireEvent.click(closeButton);

    expect(screen.getByText('Uploading...')).toBeInTheDocument();
  });

  it('should handle drag and drop with multiple file types', async () => {
    const mockOnSave = jest.fn();
    render(<ImageModal {...defaultProps} onSave={mockOnSave} />);

    const uploadArea = screen.getByText('Click to upload or drag and drop').closest('div');
    const imageFile = new File(['test1'], 'test1.png', { type: 'image/png' });
    const textFile = new File(['test2'], 'test2.txt', { type: 'text/plain' });

    if (uploadArea) {
      fireEvent.dragOver(uploadArea);
      fireEvent.drop(uploadArea, {
        dataTransfer: {
          files: [imageFile, textFile],
        },
      });
    }

    await waitFor(() => {
      expect(screen.getByText('Upload & Save (1 images)')).toBeInTheDocument();
      expect(screen.getByText('Selected Images (1)')).toBeInTheDocument();
    });
  });
});
