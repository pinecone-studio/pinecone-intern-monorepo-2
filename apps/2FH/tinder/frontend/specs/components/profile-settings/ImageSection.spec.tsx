import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ImagesSection } from '@/components/profile-settings/ImagesSection';

// Mock URL.createObjectURL for Jest environment
const mockCreateObjectURL = jest.fn(() => 'mocked-url');
Object.defineProperty(URL, 'createObjectURL', {
  writable: true,
  value: mockCreateObjectURL,
});

describe('ImagesSection Edge Cases', () => {
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    mockOnSuccess.mockClear();
    mockCreateObjectURL.mockClear();
  });

  it('handles basic functionality and image limits', () => {
    render(<ImagesSection onSuccess={mockOnSuccess} />);
    
    // Test initial state
    expect(screen.getByText('Add Image')).toBeTruthy();
    expect(screen.getAllByText(/Profile \d+/).length).toBe(6);
    
    // Test image limit logic (lines 32-33)
    const deleteButtons = screen.getAllByTitle('Delete image');
    fireEvent.click(deleteButtons[0]);
    fireEvent.click(deleteButtons[1]);
    expect(screen.getByText('Add Image')).toBeTruthy();
    
    // Test save functionality
    fireEvent.click(screen.getByText('Save Images'));
    expect(mockOnSuccess).toHaveBeenCalledWith('Images saved successfully');
  });

  it('handles image deletions and state management', () => {
    render(<ImagesSection onSuccess={mockOnSuccess} />);
    
    const deleteButtons = screen.getAllByTitle('Delete image');
    const initialCount = deleteButtons.length;
    
    // Test multiple deletions
    fireEvent.click(deleteButtons[0]);
    expect(mockOnSuccess).toHaveBeenCalledWith('Image deleted successfully');
    
    const remainingButtons = screen.getAllByTitle('Delete image');
    fireEvent.click(remainingButtons[0]);
    expect(mockOnSuccess).toHaveBeenCalledWith('Image deleted successfully');
    
    expect(screen.getAllByTitle('Delete image').length).toBe(initialCount - 2);
  });

  it('handles file upload functionality', () => {
    render(<ImagesSection onSuccess={mockOnSuccess} />);
    
    // Test upload button click (line 23)
    const uploadButton = screen.getByText('Upload image');
    fireEvent.click(uploadButton);
    
    // Test file selection with valid file
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fireEvent.change(fileInput, { target: { files: [file] } });
    }
    
    expect(mockCreateObjectURL).toHaveBeenCalledWith(file);
    expect(mockOnSuccess).toHaveBeenCalledWith('Image uploaded successfully');
    expect(screen.getAllByText(/Profile \d+/).length).toBe(7);
  });

  it('handles file input edge cases', () => {
    render(<ImagesSection onSuccess={mockOnSuccess} />);
    
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      // Test no file selected
      fireEvent.change(fileInput, { target: { files: [] } });
      expect(mockCreateObjectURL).not.toHaveBeenCalled();
      
      // Test null file
      fireEvent.change(fileInput, { target: { files: null } });
      expect(mockCreateObjectURL).not.toHaveBeenCalled();
      
      // Test undefined files
      fireEvent.change(fileInput, { target: { files: undefined } });
      expect(mockCreateObjectURL).not.toHaveBeenCalled();
    }
    
    expect(screen.getAllByText(/Profile \d+/).length).toBe(6);
  });

  it('handles file input ref edge cases', () => {
    render(<ImagesSection onSuccess={mockOnSuccess} />);
    
    // Test when file input ref is null/undefined
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.remove();
      
      const uploadButton = screen.getByText('Upload image');
      fireEvent.click(uploadButton);
      expect(mockOnSuccess).not.toHaveBeenCalled();
    }
  });

  it('handles image deletion edge cases', () => {
    render(<ImagesSection onSuccess={mockOnSuccess} />);
    
    // Test that we can delete images and the count decreases
    const initialDeleteButtons = screen.getAllByTitle('Delete image');
    const initialCount = initialDeleteButtons.length;
    
    // Delete some images
    fireEvent.click(initialDeleteButtons[0]);
    fireEvent.click(initialDeleteButtons[1]);
    
    const remainingDeleteButtons = screen.getAllByTitle('Delete image');
    expect(remainingDeleteButtons.length).toBe(initialCount - 2);
    
    // Should still show Add Image placeholder
    expect(screen.getByText('Add Image')).toBeTruthy();
  });
});
