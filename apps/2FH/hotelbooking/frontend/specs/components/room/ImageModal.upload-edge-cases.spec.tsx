import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ImageModal } from '../../../src/components/room/ImageModal';

global.fetch = jest.fn();
global.URL.createObjectURL = jest.fn(() => 'https://example.com/mocked-url');

describe('ImageModal Upload Edge Cases', () => {
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

  it('should not upload when no files are selected', async () => {
    const mockOnSave = jest.fn();
    render(<ImageModal {...defaultProps} onSave={mockOnSave} />);
    const saveButton = screen.getByText('Upload & Save (0 images)');
    saveButton.removeAttribute('disabled');
    fireEvent.click(saveButton);
    expect(mockOnSave).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should handle upload with no files after removal', async () => {
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
    });
    const saveButton = screen.getByText('Upload & Save (0 images)');
    saveButton.removeAttribute('disabled');
    fireEvent.click(saveButton);
    expect(mockOnSave).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
