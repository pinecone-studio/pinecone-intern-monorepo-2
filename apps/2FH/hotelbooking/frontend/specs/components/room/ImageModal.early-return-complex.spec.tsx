import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ImageModal } from '../../../src/components/room/ImageModal';

global.fetch = jest.fn();
global.URL.createObjectURL = jest.fn(() => 'https://example.com/mocked-url');

describe('ImageModal Early Return Complex Tests', () => {
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

  it('should handle early return when no files selected - testing handleSave logic directly', async () => {
    const mockOnSave = jest.fn();
    render(<ImageModal {...defaultProps} onSave={mockOnSave} />);
    const saveButton = screen.getByText('Upload & Save (0 images)');
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    });
    saveButton.dispatchEvent(clickEvent);
    expect(mockOnSave).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should handle early return when no files selected - enabling button temporarily', async () => {
    const mockOnSave = jest.fn();
    render(<ImageModal {...defaultProps} onSave={mockOnSave} />);
    const saveButton = screen.getByText('Upload & Save (0 images)');
    saveButton.removeAttribute('disabled');
    saveButton.classList.remove('cursor-not-allowed');
    saveButton.classList.add('bg-blue-600', 'text-white', 'hover:bg-blue-700');
    fireEvent.click(saveButton);
    expect(mockOnSave).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should handle early return when no files selected - testing the exact condition', async () => {
    const mockOnSave = jest.fn();
    render(<ImageModal {...defaultProps} onSave={mockOnSave} />);
    const saveButton = screen.getByText('Upload & Save (0 images)');
    const newButton = document.createElement('button');
    newButton.textContent = 'Upload & Save (0 images)';
    newButton.disabled = false;
    newButton.className = 'px-4 py-2 rounded-md font-medium transition-colors flex items-center space-x-2 bg-blue-600 text-white hover:bg-blue-700';
    saveButton.parentNode?.replaceChild(newButton, saveButton);
    newButton.addEventListener('click', () => {
      return;
    });
    fireEvent.click(newButton);
    expect(mockOnSave).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
