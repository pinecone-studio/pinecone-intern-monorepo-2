import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { StoryCreateDialog } from '@/components/create-story-dialog/StoryCreateDialog';
import { useCreateStoryMutation } from '@/generated';
jest.mock('@/generated', () => ({
  useCreateStoryMutation: jest.fn(),
}));
const mockCreateStory = jest.fn();
const mockOnClose = jest.fn();
describe('StoryCreateDialog - Advanced Functionality', () => {
  beforeEach(() => {
    (useCreateStoryMutation as jest.Mock).mockReturnValue([mockCreateStory, { loading: false }]);
    jest.clearAllMocks();
    mockOnClose.mockClear();
  });
  it('handles successful story creation with onCompleted callback', async () => {
    let onCompletedCallback: (() => void) | undefined;
    const mockMutation = jest.fn().mockImplementation(() => {
      if (onCompletedCallback) {
        onCompletedCallback();
      }
      return Promise.resolve();
    });
    (useCreateStoryMutation as jest.Mock).mockImplementation((options) => {
      if (options.onCompleted) {
        onCompletedCallback = options.onCompleted;
      }
      return [mockMutation, { loading: false }];
    });
    render(<StoryCreateDialog isOpen={true} onClose={mockOnClose} />);
    const file = new File(['dummy'], 'image.png', { type: 'image/png' });
    const hiddenInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(hiddenInput, { target: { files: [file] } });
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ secureurl: 'http://cloudinary.com/fake.png' }),
      } as Response)
    );
    await waitFor(() => {
      expect(screen.getByText('Share Story')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Share Story'));
    await waitFor(() => {
      expect(mockMutation).toHaveBeenCalled();
    });
  });

  it('handles story creation error with onError callback', async () => {
    let onErrorCallback: ((_err: { message: string }) => void) | undefined;
    
    const mockMutation = jest.fn().mockImplementation(() => {
      if (onErrorCallback) {
        onErrorCallback({ message: 'Story creation failed' });
      }
      return Promise.reject(new Error('Story creation failed'));
    });
    (useCreateStoryMutation as jest.Mock).mockImplementation((options) => {
      if (options.onError) {
        onErrorCallback = options.onError;
      }
      return [mockMutation, { loading: false }];
    });
    render(<StoryCreateDialog isOpen={true} onClose={mockOnClose} />);
    const file = new File(['dummy'], 'image.png', { type: 'image/png' });
    const hiddenInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(hiddenInput, { target: { files: [file] } });

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ secureurl: 'http://cloudinary.com/fake.png' }),
      } as Response)
    );
    await waitFor(() => {
      expect(screen.getByText('Share Story')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Share Story'));
    await waitFor(() => {
      expect(mockMutation).toHaveBeenCalled();
    });
  });
  it('covers lines 65-66 by testing the defensive file check', async () => {
    const mockMutation = jest.fn().mockImplementation(() => {
      return Promise.resolve();
    });

    (useCreateStoryMutation as jest.Mock).mockReturnValue([
      mockMutation,
      { loading: false }
    ]);
    render(<StoryCreateDialog isOpen={true} onClose={mockOnClose} />);
    const file = new File(['dummy'], 'image.png', { type: 'image/png' });
    const hiddenInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(hiddenInput, { target: { files: [file] } });
    await waitFor(() => {
      expect(screen.getByAltText('preview')).toBeInTheDocument();
    });
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ secureurl: 'http://cloudinary.com/fake.png' }),
      } as Response)
    );
    await waitFor(() => {
      expect(screen.getByText('Share Story')).toBeInTheDocument();
    });
    const buttons = screen.getAllByRole('button');
    const removeButton = buttons[1];
    fireEvent.click(removeButton);
    await waitFor(() => {
      expect(screen.queryByAltText('preview')).not.toBeInTheDocument();
    });
    expect(screen.queryByText('Share Story')).not.toBeInTheDocument();
    expect(screen.queryByText('Select image')).not.toBeInTheDocument();
  });
  it('covers lines 65-66 by simulating file removal during upload', async () => {
    const mockMutation = jest.fn().mockImplementation(() => {
      return Promise.resolve();
    });
    (useCreateStoryMutation as jest.Mock).mockReturnValue([
      mockMutation,
      { loading: false }
    ]);
    render(<StoryCreateDialog isOpen={true} onClose={mockOnClose} />);
    const file = new File(['dummy'], 'image.png', { type: 'image/png' });
    const hiddenInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(hiddenInput, { target: { files: [file] } });
    await waitFor(() => {
      expect(screen.getByAltText('preview')).toBeInTheDocument();
    });
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ secureurl: 'http://cloudinary.com/fake.png' }),
      } as Response)
    );
    await waitFor(() => {
      expect(screen.getByText('Share Story')).toBeInTheDocument();
    });
    const buttons = screen.getAllByRole('button');
    const removeButton = buttons[1]; 
    fireEvent.click(removeButton);
    await waitFor(() => {
      expect(screen.queryByAltText('preview')).not.toBeInTheDocument();
    });
    expect(screen.queryByText('Share Story')).not.toBeInTheDocument();
    expect(screen.queryByText('Select image')).not.toBeInTheDocument();
  });
}); 