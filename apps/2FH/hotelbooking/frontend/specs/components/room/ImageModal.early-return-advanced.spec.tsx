import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ImageModal, ImageModalRef } from '../../../src/components/room/ImageModal';

global.fetch = jest.fn();
global.URL.createObjectURL = jest.fn(() => 'https://example.com/mocked-url');

describe('ImageModal Early Return Advanced Tests', () => {
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

  it('should handle early return when no files selected - testing the handleSave function directly', async () => {
    const mockOnSave = jest.fn();
    const modalRef = React.createRef<ImageModalRef>();
    render(<ImageModal {...defaultProps} onSave={mockOnSave} ref={modalRef} />);
    await modalRef.current?.handleSave();
    expect(mockOnSave).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should handle early return when no files selected - testing the condition directly', async () => {
    const mockOnSave = jest.fn();
    render(<ImageModal {...defaultProps} onSave={mockOnSave} />);

    const saveButton = screen.getByText('Upload & Save (0 images)');
    fireEvent.click(saveButton, { bubbles: true });
    expect(mockOnSave).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('should handle early return when no files selected - using React Testing Library act', async () => {
    const mockOnSave = jest.fn();

    render(<ImageModal {...defaultProps} onSave={mockOnSave} />);
    const saveButton = screen.getByText('Upload & Save (0 images)');
    await act(async () => {
      saveButton.removeAttribute('disabled');
      saveButton.classList.remove('cursor-not-allowed');
      saveButton.classList.add('bg-blue-600', 'text-white', 'hover:bg-blue-700');
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
});
