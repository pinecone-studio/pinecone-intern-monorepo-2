import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { DialogContentHeader, handleBackbutton } from '@/components/create-post-dialog/ContentHeader';

const Stages = ['Select', 'Crop', 'Caption', 'Creating'];

describe('DialogContentHeader', () => {
  const mockSetStage = jest.fn();
  const mockHandleCreatePost = jest.fn();
  const mockSetIsPostDialogOpen = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders stage title correctly', () => {
    render(<DialogContentHeader stage={Stages[1]} Stages={Stages} setStage={mockSetStage} handleCreatePost={mockHandleCreatePost} setIsPostDialogOpen={mockSetIsPostDialogOpen} isUploading={false} />);
    expect(screen.getByText('Crop')).toBeInTheDocument();
  });

  it('shows back arrow for non-first and non-last stages', () => {
    render(<DialogContentHeader stage={Stages[1]} Stages={Stages} setStage={mockSetStage} handleCreatePost={mockHandleCreatePost} setIsPostDialogOpen={mockSetIsPostDialogOpen} isUploading={false} />);
    expect(screen.getByTestId('back-arrow')).toBeInTheDocument();
  });

  it('shows next button for non-last stages', () => {
    render(<DialogContentHeader stage={Stages[1]} Stages={Stages} setStage={mockSetStage} handleCreatePost={mockHandleCreatePost} setIsPostDialogOpen={mockSetIsPostDialogOpen} isUploading={false} />);
    expect(screen.getByTestId('next-button')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('shows Share button for Caption stage', () => {
    render(<DialogContentHeader stage={Stages[2]} Stages={Stages} setStage={mockSetStage} handleCreatePost={mockHandleCreatePost} setIsPostDialogOpen={mockSetIsPostDialogOpen} isUploading={false} />);
    expect(screen.getByText('Share')).toBeInTheDocument();
  });

  it('handles back button click for Crop stage (shows discard dialog)', () => {
    render(<DialogContentHeader stage={Stages[1]} Stages={Stages} setStage={mockSetStage} handleCreatePost={mockHandleCreatePost} setIsPostDialogOpen={mockSetIsPostDialogOpen} isUploading={false} />);
    fireEvent.click(screen.getByTestId('back-arrow'));
    expect(screen.getByText('Discard post?')).toBeInTheDocument();
  });

  it('handles back button click for Caption stage (goes to previous stage)', () => {
    render(<DialogContentHeader stage={Stages[2]} Stages={Stages} setStage={mockSetStage} handleCreatePost={mockHandleCreatePost} setIsPostDialogOpen={mockSetIsPostDialogOpen} isUploading={false} />);
    fireEvent.click(screen.getByTestId('back-arrow'));
    expect(mockSetStage).toHaveBeenCalledWith(Stages[1]);
  });

  it('handles next button click (advances to next stage)', () => {
    render(<DialogContentHeader stage={Stages[1]} Stages={Stages} setStage={mockSetStage} handleCreatePost={mockHandleCreatePost} setIsPostDialogOpen={mockSetIsPostDialogOpen} isUploading={false} />);
    fireEvent.click(screen.getByTestId('next-button'));
    expect(mockSetStage).toHaveBeenCalledWith(Stages[2]);
  });

  it('handles Share button click (calls handleCreatePost)', async () => {
    mockHandleCreatePost.mockResolvedValue(undefined);
    render(<DialogContentHeader stage={Stages[2]} Stages={Stages} setStage={mockSetStage} handleCreatePost={mockHandleCreatePost} setIsPostDialogOpen={mockSetIsPostDialogOpen} isUploading={false} />);
    fireEvent.click(screen.getByTestId('next-button'));
    await waitFor(() => {
      expect(mockHandleCreatePost).toHaveBeenCalled();
    });
    expect(mockSetStage).toHaveBeenCalledWith(Stages[3]);
  });

  it('handles discard confirm', () => {
    render(<DialogContentHeader stage={Stages[1]} Stages={Stages} setStage={mockSetStage} handleCreatePost={mockHandleCreatePost} setIsPostDialogOpen={mockSetIsPostDialogOpen} isUploading={false} />);
    fireEvent.click(screen.getByTestId('back-arrow'));
    fireEvent.click(screen.getByTestId('discard-confirm'));
    expect(mockSetIsPostDialogOpen).toHaveBeenCalledWith(false);
  });

  it('handles discard cancel', () => {
    render(<DialogContentHeader stage={Stages[1]} Stages={Stages} setStage={mockSetStage} handleCreatePost={mockHandleCreatePost} setIsPostDialogOpen={mockSetIsPostDialogOpen} isUploading={false} />);
    fireEvent.click(screen.getByTestId('back-arrow'));
    fireEvent.click(screen.getByTestId('discard-cancel'));
    expect(screen.queryByText('Discard post?')).not.toBeInTheDocument();
  });

  it('disables Share button when uploading', () => {
    render(<DialogContentHeader stage={Stages[2]} Stages={Stages} setStage={mockSetStage} handleCreatePost={mockHandleCreatePost} setIsPostDialogOpen={mockSetIsPostDialogOpen} isUploading={true} />);
    const button = screen.getByTestId('next-button');
    expect(button).toBeDisabled();
    expect(screen.queryByText('Share')).not.toBeInTheDocument();
  });
  it('covers _stage === Stages[2] branch in handleBackbutton', () => {
    render(<DialogContentHeader stage={Stages[2]} Stages={Stages} setStage={mockSetStage} handleCreatePost={mockHandleCreatePost} setIsPostDialogOpen={mockSetIsPostDialogOpen} isUploading={false} />);
    fireEvent.click(screen.getByTestId('back-arrow'));
    expect(mockSetStage).toHaveBeenCalledWith(Stages[1]);
  });
  it('covers _stage === Stages[1] branch in handleBackbutton', () => {
    render(<DialogContentHeader stage={Stages[1]} Stages={Stages} setStage={mockSetStage} handleCreatePost={mockHandleCreatePost} setIsPostDialogOpen={mockSetIsPostDialogOpen} isUploading={false} />);
    fireEvent.click(screen.getByTestId('back-arrow'));
    expect(screen.getByText('Discard post?')).toBeInTheDocument();
  });

  it('covers _stage !== Stages[1] && _stage !== Stages[2] branch in handleBackbutton', () => {
    render(<DialogContentHeader stage={Stages[0]} Stages={Stages} setStage={mockSetStage} handleCreatePost={mockHandleCreatePost} setIsPostDialogOpen={mockSetIsPostDialogOpen} isUploading={false} />);
    expect(screen.queryByTestId('back-arrow')).not.toBeInTheDocument();
  });

  it('covers _stage !== Stages[1] && _stage !== Stages[2] branch in handleBackbutton for Creating stage', () => {
    render(<DialogContentHeader stage={Stages[3]} Stages={Stages} setStage={mockSetStage} handleCreatePost={mockHandleCreatePost} setIsPostDialogOpen={mockSetIsPostDialogOpen} isUploading={false} />);
    expect(screen.queryByTestId('back-arrow')).not.toBeInTheDocument();
  });

  it('covers unreachable branch in handleBackbutton when stage is neither Stages[1] nor Stages[2]', () => {
    const mockSetShowDiscard = jest.fn();
    handleBackbutton(Stages[0], Stages, mockSetStage, mockSetShowDiscard);
    expect(mockSetStage).not.toHaveBeenCalled();
    expect(mockSetShowDiscard).not.toHaveBeenCalled();
  });

  it('covers _stage === Stages[1] branch in handleNextButton', () => {
    render(<DialogContentHeader stage={Stages[1]} Stages={Stages} setStage={mockSetStage} handleCreatePost={mockHandleCreatePost} setIsPostDialogOpen={mockSetIsPostDialogOpen} isUploading={false} />);
    fireEvent.click(screen.getByTestId('next-button'));
    expect(mockSetStage).toHaveBeenCalledWith(Stages[2]);
  });

  it('covers _stage === Stages[2] branch in handleNextButton', async () => {
    mockHandleCreatePost.mockResolvedValue(undefined);
    render(<DialogContentHeader stage={Stages[2]} Stages={Stages} setStage={mockSetStage} handleCreatePost={mockHandleCreatePost} setIsPostDialogOpen={mockSetIsPostDialogOpen} isUploading={false} />);
    fireEvent.click(screen.getByTestId('next-button'));
    await waitFor(() => {
      expect(mockHandleCreatePost).toHaveBeenCalled();
    });
    expect(mockSetStage).toHaveBeenCalledWith(Stages[3]);
  });

  it('covers _stage !== Stages[1] && _stage !== Stages[2] branch in handleNextButton', () => {
    render(<DialogContentHeader stage={Stages[0]} Stages={Stages} setStage={mockSetStage} handleCreatePost={mockHandleCreatePost} setIsPostDialogOpen={mockSetIsPostDialogOpen} isUploading={false} />);
    expect(screen.getByTestId('next-button')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('next-button'));
    expect(mockSetStage).not.toHaveBeenCalled();
    expect(mockHandleCreatePost).not.toHaveBeenCalled();
  });

  it('covers _stage === Stages[2] && isUploading branch in button disabled', () => {
    render(<DialogContentHeader stage={Stages[2]} Stages={Stages} setStage={mockSetStage} handleCreatePost={mockHandleCreatePost} setIsPostDialogOpen={mockSetIsPostDialogOpen} isUploading={true} />);
    const button = screen.getByTestId('next-button');
    expect(button).toBeDisabled();
  });

  it('covers _stage === Stages[2] && !isUploading branch in button text', () => {
    render(<DialogContentHeader stage={Stages[2]} Stages={Stages} setStage={mockSetStage} handleCreatePost={mockHandleCreatePost} setIsPostDialogOpen={mockSetIsPostDialogOpen} isUploading={false} />);
    expect(screen.getByText('Share')).toBeInTheDocument();
  });

  it('covers _stage !== Stages[2] branch in button text', () => {
    render(<DialogContentHeader stage={Stages[1]} Stages={Stages} setStage={mockSetStage} handleCreatePost={mockHandleCreatePost} setIsPostDialogOpen={mockSetIsPostDialogOpen} isUploading={false} />);
    expect(screen.getByText('Next')).toBeInTheDocument();
  });
});
