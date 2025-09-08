import { render, screen, fireEvent } from '@testing-library/react';
import { PostDialog } from '../PostDialog';
import { useRouter } from 'next/navigation';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockPush = jest.fn();
const mockRouter = {
  push: mockPush,
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
};

(useRouter as jest.Mock).mockReturnValue(mockRouter);

const mockPostAuthor = {
  _id: 'user123',
  userName: 'testuser',
};

const defaultProps = {
  isOpen: true,
  onClose: jest.fn(),
  postId: 'post123',
  postAuthor: mockPostAuthor,
};

describe('PostDialog', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders when open', () => {
    render(<PostDialog {...defaultProps} />);

    expect(screen.getByText('Go to Post')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<PostDialog {...defaultProps} isOpen={false} />);

    expect(screen.queryByText('Go to Post')).not.toBeInTheDocument();
  });

  it('shows edit and delete options when provided', () => {
    const onDelete = jest.fn();
    const onEdit = jest.fn();

    render(<PostDialog {...defaultProps} onDelete={onDelete} onEdit={onEdit} />);

    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('calls onClose when cancel is clicked', () => {
    const onClose = jest.fn();
    render(<PostDialog {...defaultProps} onClose={onClose} />);

    fireEvent.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', () => {
    const onClose = jest.fn();
    render(<PostDialog {...defaultProps} onClose={onClose} />);

    const backdrop = document.querySelector('.fixed.inset-0');
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(onClose).toHaveBeenCalledTimes(1);
    }
  });

  it('navigates to post detail when "Go to Post" is clicked', () => {
    render(<PostDialog {...defaultProps} />);

    fireEvent.click(screen.getByText('Go to Post'));
    expect(mockPush).toHaveBeenCalledWith('/testuser/post/post123');
  });

  it('calls onEdit when edit is clicked', () => {
    const onEdit = jest.fn();
    render(<PostDialog {...defaultProps} onEdit={onEdit} />);

    fireEvent.click(screen.getByText('Edit'));
    expect(onEdit).toHaveBeenCalledWith('post123');
  });

  it('calls onDelete when delete is clicked', async () => {
    const onDelete = jest.fn().mockResolvedValue(undefined);
    render(<PostDialog {...defaultProps} onDelete={onDelete} />);

    fireEvent.click(screen.getByText('Delete'));
    expect(onDelete).toHaveBeenCalledWith('post123');
  });

  it('shows loading state when deleting', async () => {
    const onDelete = jest.fn().mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));
    render(<PostDialog {...defaultProps} onDelete={onDelete} />);

    fireEvent.click(screen.getByText('Delete'));
    expect(screen.getByText('Deleting...')).toBeInTheDocument();
  });
});
