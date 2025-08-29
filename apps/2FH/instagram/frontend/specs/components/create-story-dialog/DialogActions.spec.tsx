import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DialogActions } from '@/components/create-story-dialog/DialogActions';

describe('DialogActions', () => {
  const mockOnUpload = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Cancel button always', () => {
    render(
      <DialogActions
        file={null}
        isUploading={false}
        loading={false}
        onUpload={mockOnUpload}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.queryByText('Share Story')).not.toBeInTheDocument();
  });

  it('renders Share Story button when file is provided', () => {
    const fakeFile = new File(['test'], 'test.png', { type: 'image/png' });

    render(
      <DialogActions
        file={fakeFile}
        isUploading={false}
        loading={false}
        onUpload={mockOnUpload}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('Share Story')).toBeInTheDocument();
  });

  it('calls onClose when Cancel clicked', () => {
    render(
      <DialogActions
        file={null}
        isUploading={false}
        loading={false}
        onUpload={mockOnUpload}
        onClose={mockOnClose}
      />
    );

    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onUpload when Share Story clicked', () => {
    const fakeFile = new File(['test'], 'test.png', { type: 'image/png' });

    render(
      <DialogActions
        file={fakeFile}
        isUploading={false}
        loading={false}
        onUpload={mockOnUpload}
        onClose={mockOnClose}
      />
    );

    fireEvent.click(screen.getByText('Share Story'));
    expect(mockOnUpload).toHaveBeenCalledTimes(1);
  });

  it('disables buttons when uploading or loading', () => {
    const fakeFile = new File(['test'], 'test.png', { type: 'image/png' });

    render(
      <DialogActions
        file={fakeFile}
        isUploading={true}
        loading={false}
        onUpload={mockOnUpload}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('Cancel')).toBeDisabled();
    expect(screen.getByText('Share Story')).toBeDisabled();
  });
});
