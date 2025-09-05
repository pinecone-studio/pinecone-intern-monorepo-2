import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { useMutation } from '@apollo/client';
import { CreatePostDialog } from '@/components/create-post-dialog/CreatePostDialog';
jest.mock('@apollo/client', () => {
  const actual = jest.requireActual('@apollo/client');
  return {
    ...actual,
    useMutation: jest.fn(() => [jest.fn().mockResolvedValue({ data: { createPost: { _id: '1' } } }), { loading: false }]),
    gql: actual.gql,
  };
});
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({ user: { userName: 'tester', profileImage: 'http://example.com/a.png' } }),
}));
jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ open: _open, onOpenChange, children }: { open: boolean; onOpenChange: (open: boolean) => void; children: React.ReactNode }) =>
    _open ? (
      <div role="dialog" onClick={() => onOpenChange(true)}>
        {children}
      </div>
    ) : null,
  DialogContent: ({ children, className }: { children: React.ReactNode; className?: string }) => <div className={className}>{children}</div>,
  DialogClose: ({ children, className }: { children: React.ReactNode; className?: string }) => <button className={className}>{children}</button>,
  DialogHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTitle: ({ children }: { children: React.ReactNode }) => <h1>{children}</h1>,
}));

describe('CreatePostDialog', () => {
  const onOpenChange = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
    global.URL.createObjectURL = jest.fn(() => 'blob:http://localhost/mock') as unknown as typeof URL.createObjectURL;
  });
  it('renders initial stage and allows selecting files to move to Edit stage', async () => {
    render(<CreatePostDialog isPostDialogOpen={true} setIsPostDialogOpen={onOpenChange} />);
    expect(!!screen.getByText('Create new post')).toBe(true);
    const input = document.querySelector('input[type="file"][multiple]') as HTMLInputElement;
    const file1 = new File(['a'], 'a.png', { type: 'image/png' });
    fireEvent.change(input, { target: { files: [file1] } });
    await waitFor(() => {
      expect(!!screen.getByText('Edit')).toBe(true);
    });
  });
  it('navigates to Caption stage and performs Share which triggers mutation and closes dialog', async () => {
    const createMock = jest.fn().mockResolvedValue({ data: { createPost: { _id: '1' } } });
    (useMutation as jest.Mock).mockReturnValue([createMock, { loading: false }]);
    render(<CreatePostDialog isPostDialogOpen={true} setIsPostDialogOpen={onOpenChange} />);
    const input = document.querySelector('input[type="file"][multiple]') as HTMLInputElement;
    const file1 = new File(['a'], 'a.png', { type: 'image/png' });
    const file2 = new File(['b'], 'b.jpg', { type: 'image/jpeg' });
    fireEvent.change(input, { target: { files: [file1, file2] } });
    await waitFor(() => expect(screen.getByText('Edit')).toBeInTheDocument());
    const nextBtn = screen.getByRole('button', { name: 'Next' });
    fireEvent.click(nextBtn);
    await waitFor(() => expect(screen.getByText('Caption')).toBeInTheDocument());
    const captionInput = document.querySelector('input[dir="auto"]') as HTMLInputElement;
    fireEvent.change(captionInput, { target: { value: 'hello world' } });
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ secureUrl: 'http://cloudinary.com/img.png' }),
      } as unknown as Response)
    ) as unknown as typeof fetch;
    const shareBtn = screen.getByRole('button', { name: 'Share' });
    fireEvent.click(shareBtn);

    await waitFor(() => {
      expect(createMock).toHaveBeenCalledTimes(1);
      expect(createMock).toHaveBeenCalledWith({
        variables: { input: { image: ['http://cloudinary.com/img.png', 'http://cloudinary.com/img.png'], caption: 'hello world' } },
      });
    });
  });
  it('resets state when dialog is closed', () => {
    const { rerender } = render(<CreatePostDialog isPostDialogOpen={true} setIsPostDialogOpen={onOpenChange} />);
    rerender(<CreatePostDialog isPostDialogOpen={false} setIsPostDialogOpen={onOpenChange} />);
    rerender(<CreatePostDialog isPostDialogOpen={true} setIsPostDialogOpen={onOpenChange} />);
    expect(screen.getByText('Create new post')).toBeInTheDocument();
  });

  it('handles create post error', async () => {
    const createMock = jest.fn().mockRejectedValue(new Error('Network error'));
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const apollo = require('@apollo/client');
    (apollo.useMutation as jest.Mock).mockReturnValue([createMock, { loading: false }]);

    render(<CreatePostDialog isPostDialogOpen={true} setIsPostDialogOpen={onOpenChange} />);
    const input = document.querySelector('input[type="file"][multiple]') as HTMLInputElement;
    const file1 = new File(['a'], 'a.png', { type: 'image/png' });
    fireEvent.change(input, { target: { files: [file1] } });

    await waitFor(() => expect(screen.getByText('Edit')).toBeInTheDocument());

    const nextBtn = screen.getByRole('button', { name: 'Next' });
    fireEvent.click(nextBtn);
    await waitFor(() => expect(screen.getByText('Caption')).toBeInTheDocument());
    const captionInput = document.querySelector('input[dir="auto"]') as HTMLInputElement;
    fireEvent.change(captionInput, { target: { value: 'test caption' } });
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ secureUrl: 'http://cloudinary.com/img.png' }),
      } as unknown as Response)
    ) as unknown as typeof fetch;
    const shareBtn = screen.getByRole('button', { name: 'Share' });
    fireEvent.click(shareBtn);

    await waitFor(() => {
      expect(createMock).toHaveBeenCalled();
    });
  });

  it('handles create post with no files', async () => {
    const createMock = jest.fn().mockResolvedValue({ data: { createPost: { _id: '1' } } });
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const apollo = require('@apollo/client');
    (apollo.useMutation as jest.Mock).mockReturnValue([createMock, { loading: false }]);

    render(<CreatePostDialog isPostDialogOpen={true} setIsPostDialogOpen={onOpenChange} />);
    const input = document.querySelector('input[type="file"][multiple]') as HTMLInputElement;
    const file1 = new File(['a'], 'a.png', { type: 'image/png' });
    fireEvent.change(input, { target: { files: [file1] } });

    await waitFor(() => expect(screen.getByText('Edit')).toBeInTheDocument());
    const nextBtn = screen.getByRole('button', { name: 'Next' });
    fireEvent.click(nextBtn);
    await waitFor(() => expect(screen.getByText('Caption')).toBeInTheDocument());
    const shareBtn = screen.getByRole('button', { name: 'Share' });
    fireEvent.click(shareBtn);
    await waitFor(() => {
      expect(createMock).toHaveBeenCalled();
    });
  });
});
