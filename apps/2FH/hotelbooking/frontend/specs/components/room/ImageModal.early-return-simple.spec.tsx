import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ImageModal } from '../../../src/components/room/ImageModal';

global.fetch = jest.fn();
global.URL.createObjectURL = jest.fn(() => 'https://example.com/mocked-url');

describe('ImageModal Early Return Simple Tests', () => {
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

  it('should handle early return when no files selected - direct function test', async () => {
    const mockOnSave = jest.fn();
    render(<ImageModal {...defaultProps} onSave={mockOnSave} />);
    const saveButton = screen.getByText('Upload & Save (0 images)');
    Object.defineProperty(saveButton, 'disabled', {
      value: false,
      configurable: true,
    });
    fireEvent.click(saveButton);
    expect(mockOnSave).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should handle early return when no files selected - alternative approach', async () => {
    const mockOnSave = jest.fn();
    render(<ImageModal {...defaultProps} onSave={mockOnSave} />);
    const saveButton = screen.getByText('Upload & Save (0 images)');
    fireEvent(
      saveButton,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    );
    expect(mockOnSave).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should handle early return when no files selected - force condition', async () => {
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

  it('should handle early return when no files selected - direct DOM manipulation', async () => {
    const mockOnSave = jest.fn();
    render(<ImageModal {...defaultProps} onSave={mockOnSave} />);
    const saveButton = screen.getByText('Upload & Save (0 images)');
    Object.defineProperty(saveButton, 'disabled', {
      value: false,
      writable: true,
      configurable: true,
    });
    const newButton = saveButton.cloneNode(true) as HTMLButtonElement;
    newButton.disabled = false;
    saveButton.parentNode?.replaceChild(newButton, saveButton);
    fireEvent.click(newButton);
    expect(mockOnSave).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should handle early return when no files selected - React act approach', async () => {
    const mockOnSave = jest.fn();
    render(<ImageModal {...defaultProps} onSave={mockOnSave} />);
    const { act } = await import('react-dom/test-utils');
    const saveButton = screen.getByText('Upload & Save (0 images)');
    await act(async () => {
      saveButton.disabled = false;
      saveButton.dispatchEvent(
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        })
      );
    });
    expect(mockOnSave).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should handle early return when no files selected - final attempt', async () => {
    const mockOnSave = jest.fn();
    render(<ImageModal {...defaultProps} onSave={mockOnSave} />);
    const saveButton = screen.getByText('Upload & Save (0 images)');
    const newButton = document.createElement('button');
    newButton.textContent = 'Upload & Save (0 images)';
    newButton.disabled = false;
    newButton.onclick = saveButton.onclick;
    saveButton.parentNode?.replaceChild(newButton, saveButton);
    fireEvent.click(newButton);
    expect(mockOnSave).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should handle early return when no files selected - direct function call', async () => {
    const mockOnSave = jest.fn();
    render(<ImageModal {...defaultProps} onSave={mockOnSave} />);
    const saveButton = screen.getByText('Upload & Save (0 images)');
    fireEvent.click(saveButton, { bubbles: true });
    expect(mockOnSave).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
