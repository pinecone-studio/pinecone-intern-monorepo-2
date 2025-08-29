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

describe('StoryCreateDialog - Basic Functionality', () => {
  beforeEach(() => {
    mockCreateStory.mockResolvedValue({ data: { createStory: { id: '1' } } });
    (useCreateStoryMutation as jest.Mock).mockReturnValue([mockCreateStory, { loading: false }]);
    jest.clearAllMocks();
    mockOnClose.mockClear();
  });

  it('renders nothing if isOpen is false', () => {
    const { container } = render(<StoryCreateDialog isOpen={false} onClose={mockOnClose} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the dialog when isOpen is true', () => {
    render(<StoryCreateDialog isOpen={true} onClose={mockOnClose} />);
    expect(screen.getByText('Create Story')).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(3);
  });

  it('calls onClose when close button is clicked', () => {
    render(<StoryCreateDialog isOpen={true} onClose={mockOnClose} />);
    const closeButton = screen.getAllByRole('button')[0];
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('selects a valid image file and shows preview', async () => {
    render(<StoryCreateDialog isOpen={true} onClose={mockOnClose} />);

    const file = new File(['dummy'], 'image.png', { type: 'image/png' });
    const hiddenInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(hiddenInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByAltText('preview')).toBeInTheDocument();
    });
  });

  it('shows error if non-image file is selected', async () => {
    render(<StoryCreateDialog isOpen={true} onClose={mockOnClose} />);

    const file = new File(['dummy'], 'file.txt', { type: 'text/plain' });
    const hiddenInput = document.querySelector('input[type="file"]') as HTMLInputElement;

    fireEvent.change(hiddenInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText('Select image only')).toBeInTheDocument();
    });
  });

  it('removes preview when remove button clicked', async () => {
    render(<StoryCreateDialog isOpen={true} onClose={mockOnClose} />);

    const file = new File(['dummy'], 'image.png', { type: 'image/png' });
    const hiddenInput = document.querySelector('input[type="file"]') as HTMLInputElement;

    fireEvent.change(hiddenInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByAltText('preview')).toBeInTheDocument();
    });

    const buttons = screen.getAllByRole('button');
    const removeButton = buttons[1];
    fireEvent.click(removeButton);
    expect(screen.queryByAltText('preview')).not.toBeInTheDocument();
  });

  it('shows error when uploading without file', async () => {
    render(<StoryCreateDialog isOpen={true} onClose={mockOnClose} />);
    expect(screen.queryByText('Share Story')).not.toBeInTheDocument();
  });

  it('calls createStory mutation after successful Cloudinary upload', async () => {
    render(<StoryCreateDialog isOpen={true} onClose={mockOnClose} />);

    const file = new File(['dummy'], 'image.png', { type: 'image/png' });
    const hiddenInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(hiddenInput, { target: { files: [file] } });

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ secureUrl: 'http://cloudinary.com/fake.png' }),
      } as Response)
    );

    await waitFor(() => {
      expect(screen.getByText('Share Story')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Share Story'));

    await waitFor(() => {
      expect(mockCreateStory).toHaveBeenCalledWith({ variables: { input: { image: 'http://cloudinary.com/fake.png' } } });
    });
  });

  it('sets error if Cloudinary upload fails', async () => {
    render(<StoryCreateDialog isOpen={true} onClose={mockOnClose} />);

    const file = new File(['dummy'], 'image.png', { type: 'image/png' });
    const hiddenInput = document.querySelector('input[type="file"]') as HTMLInputElement;

    fireEvent.change(hiddenInput, { target: { files: [file] } });

    global.fetch = jest.fn(() => Promise.resolve({ ok: false } as Response));

    await waitFor(() => {
      expect(screen.getByText('Share Story')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Share Story'));

    await waitFor(() => {
      expect(screen.getByText('Upload failed')).toBeInTheDocument();
    });
  });
}); 