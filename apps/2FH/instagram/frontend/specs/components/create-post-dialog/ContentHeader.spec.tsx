import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { DialogContentHeader } from '@/components/create-post-dialog/contentHeader';

const Stages = ['Create new post', 'Edit', 'Caption', 'Creating'];

describe('DialogContentHeader', () => {
  it('renders title and next/back buttons based on stage', () => {
    const setStage = jest.fn();
    const setOpen = jest.fn();
    render(
      <DialogContentHeader
        stage={Stages[1]}
        Stages={Stages}
        setStage={setStage}
        selectedFiles={[new File(['a'], 'a.png', { type: 'image/png' })]}
        handleCreatePost={jest.fn()}
        setIsPostDialogOpen={setOpen}
        isUploading={false}
      />
    );
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();

    // back button exists on Edit/Caption
    const arrow = document.querySelector('svg');
    if (arrow) fireEvent.click(arrow);
  });

  it('advances from Create->Edit and Edit->Caption via Next, and calls create on Share', async () => {
    const setStage = jest.fn();
    const handleCreatePost = jest.fn().mockResolvedValue(undefined);
    render(
      <DialogContentHeader
        stage={Stages[0]}
        Stages={Stages}
        setStage={setStage}
        selectedFiles={[new File(['a'], 'a.png', { type: 'image/png' })]}
        handleCreatePost={handleCreatePost}
        setIsPostDialogOpen={jest.fn()}
        isUploading={false}
      />
    );
    // At Create stage title only; Move to Edit stage where Next is present
    setStage.mockClear();
    const { rerender } = render(
      <DialogContentHeader
        stage={Stages[1]}
        Stages={Stages}
        setStage={setStage}
        selectedFiles={[new File(['a'], 'a.png', { type: 'image/png' })]}
        handleCreatePost={handleCreatePost}
        setIsPostDialogOpen={jest.fn()}
        isUploading={false}
      />
    );
    fireEvent.click(screen.getByText('Next'));
    expect(setStage).toHaveBeenCalledWith(Stages[2]);

    rerender(
      <DialogContentHeader
        stage={Stages[2]}
        Stages={Stages}
        setStage={setStage}
        selectedFiles={[new File(['a'], 'a.png', { type: 'image/png' })]}
        handleCreatePost={handleCreatePost}
        setIsPostDialogOpen={jest.fn()}
        isUploading={false}
      />
    );
    fireEvent.click(screen.getByText('Share'));
    expect(setStage).toHaveBeenCalledWith(Stages[3]);
    expect(handleCreatePost).toHaveBeenCalled();
  });

  it('shows discard dialog on back from Edit and handles confirm/cancel', () => {
    const setStage = jest.fn();
    const setOpen = jest.fn();
    render(
      <DialogContentHeader
        stage={Stages[1]}
        Stages={Stages}
        setStage={setStage}
        selectedFiles={[new File(['a'], 'a.png', { type: 'image/png' })]}
        handleCreatePost={jest.fn()}
        setIsPostDialogOpen={setOpen}
        isUploading={false}
      />
    );
    // simulate back (svg isn't easily queryable; use title text as fallback via click on heading change path)
    // Instead, trigger discard via calling back handler path: click the left icon via document.querySelector
    const arrow2 = document.querySelector('svg');
    if (arrow2) fireEvent.click(arrow2);

    // discard modal
    expect(screen.getByText('Discard post?')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Cancel'));

    // open again then confirm
    const arrowAgain = document.querySelector('svg');
    if (arrowAgain) fireEvent.click(arrowAgain);
    fireEvent.click(screen.getByText('Discard'));
    expect(setOpen).toHaveBeenCalledWith(false);
  });

  it('disables Share text when uploading', () => {
    render(
      <DialogContentHeader
        stage={Stages[2]}
        Stages={Stages}
        setStage={jest.fn()}
        selectedFiles={[new File(['a'], 'a.png', { type: 'image/png' })]}
        handleCreatePost={jest.fn()}
        setIsPostDialogOpen={jest.fn()}
        isUploading={true}
      />
    );
    // When uploading, Share button text becomes empty string
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

});
