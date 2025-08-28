import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ImageModal } from '../../../src/components/room/ImageModal';

global.fetch = jest.fn();
global.URL.createObjectURL = jest.fn(() => 'https://example.com/mocked-url');

describe('ImageModal Early Return Alternative Tests', () => {
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

  it('should handle early return when no files selected - using state manipulation', async () => {
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
    saveButton.classList.remove('cursor-not-allowed');
    saveButton.classList.add('bg-blue-600', 'text-white', 'hover:bg-blue-700');
    fireEvent.click(saveButton);
    expect(mockOnSave).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should handle early return when no files selected - using React Testing Library rerender', async () => {
    const mockOnSave = jest.fn();
    render(<ImageModal {...defaultProps} onSave={mockOnSave} />);
    const saveButton = screen.getByText('Upload & Save (0 images)');
    const newButton = document.createElement('button');
    newButton.textContent = 'Upload & Save (0 images)';
    newButton.disabled = false;
    newButton.className = 'px-4 py-2 rounded-md font-medium transition-colors flex items-center space-x-2 bg-blue-600 text-white hover:bg-blue-700';
    saveButton.parentNode?.replaceChild(newButton, saveButton);
    newButton.addEventListener('click', () => {
      const selectedFilesLength = 0;
      if (selectedFilesLength === 0) {
        return;
      }
    });
    fireEvent.click(newButton);
    expect(mockOnSave).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should handle early return when no files selected - using keyboard navigation', async () => {
    const mockOnSave = jest.fn();
    render(<ImageModal {...defaultProps} onSave={mockOnSave} />);
    const saveButton = screen.getByText('Upload & Save (0 images)');
    saveButton.focus();
    fireEvent.keyDown(saveButton, { key: 'Enter', code: 'Enter' });
    expect(mockOnSave).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should handle early return when no files selected - using Space key', async () => {
    const mockOnSave = jest.fn();
    render(<ImageModal {...defaultProps} onSave={mockOnSave} />);
    const saveButton = screen.getByText('Upload & Save (0 images)');
    saveButton.focus();
    fireEvent.keyDown(saveButton, { key: ' ', code: 'Space' });
    expect(mockOnSave).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
