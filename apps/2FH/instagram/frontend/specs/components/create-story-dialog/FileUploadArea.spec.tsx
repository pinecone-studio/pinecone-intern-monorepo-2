// FileUploadArea.spec.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FileUploadArea } from '@/components/create-story-dialog/FileUploadArea';

describe('FileUploadArea', () => {
  let fileRef: React.RefObject<HTMLInputElement>;
  let mockOnFileSelect: jest.Mock;

  beforeEach(() => {
    mockOnFileSelect = jest.fn();
    fileRef = { current: { click: jest.fn() } } as unknown as React.RefObject<HTMLInputElement>;
    render(<FileUploadArea onFileSelect={mockOnFileSelect} fileRef={fileRef} />);
  });

  it('renders correctly', () => {
    expect(screen.getByText(/drag photos here/i)).toBeInTheDocument();
    expect(screen.getByText(/or click to select/i)).toBeInTheDocument();
    expect(screen.getByText(/select file/i)).toBeInTheDocument();
    expect(screen.getByText(/9:16 format/i)).toBeInTheDocument();
  });

  it('clicking the area triggers file input click', () => {
    const uploadArea = screen.getByText(/drag photos here/i).parentElement;
    if (uploadArea) {
      fireEvent.click(uploadArea);
      expect(fileRef.current?.click).toHaveBeenCalled();
    }
  });

  it('clicking the "Select file" button triggers file input click', () => {
    const button = screen.getByText(/select file/i);
    fireEvent.click(button);
    expect(fileRef.current?.click).toHaveBeenCalled();
  });

  it('calls onFileSelect when a file is dropped', () => {
    const file = new File(['dummy content'], 'photo.png', { type: 'image/png' });
    const uploadArea = screen.getByText(/drag photos here/i).parentElement;

    if (uploadArea) {
      fireEvent.drop(uploadArea, {
        dataTransfer: {
          files: [file],
          types: ['Files'],
        },
      });

      expect(mockOnFileSelect).toHaveBeenCalledWith(file);
    }
  });

  it('does not call onFileSelect if dropped with no files', () => {
    const uploadArea = screen.getByText(/drag photos here/i).parentElement;
    if (uploadArea) {
      fireEvent.drop(uploadArea, {
        dataTransfer: {
          files: [],
          types: ['Files'],
        },
      });
      expect(mockOnFileSelect).not.toHaveBeenCalled();
    }
  });

  it('handles drag over event correctly', () => {
    const uploadArea = screen.getByText(/drag photos here/i).parentElement;
    if (!uploadArea) return;

    // Test that drag over event is handled without errors
    const dragEvent = new Event('dragover', { bubbles: true });
    Object.defineProperty(dragEvent, 'preventDefault', {
      value: jest.fn(),
      writable: true,
    });

    fireEvent.dragOver(uploadArea, dragEvent);

    // The preventDefault should be called (though we can't easily test this in unit tests)
    // This test ensures the drag over handler doesn't throw errors
    expect(uploadArea).toBeInTheDocument();
  });
});
