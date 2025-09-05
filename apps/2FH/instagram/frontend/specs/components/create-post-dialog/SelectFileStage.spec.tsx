import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { SelectFile } from '@/components/create-post-dialog/selectFileStage';
import { Dialog, DialogContent } from '@/components/ui/dialog';

describe('SelectFileStage', () => {
  it('renders title and accepts file input change', () => {
    const setSelectedFiles = jest.fn();
    render(
      <Dialog
        open
        onOpenChange={() => {
          /* no-op */
        }}
      >
        <DialogContent>
          <SelectFile setSelectedFiles={setSelectedFiles} stage="Create new post" />
        </DialogContent>
      </Dialog>
    );
    expect(screen.getByText('Create new post')).toBeInTheDocument();
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['a'], 'a.png', { type: 'image/png' });
    fireEvent.change(input, { target: { files: [file] } });
    expect(setSelectedFiles).toHaveBeenCalled();
  });

  it('handles drag/drop images only', () => {
    const setSelectedFiles = jest.fn();
    render(
      <Dialog
        open
        onOpenChange={() => {
          /* no-op */
        }}
      >
        <DialogContent>
          <SelectFile setSelectedFiles={setSelectedFiles} stage="Create new post" />
        </DialogContent>
      </Dialog>
    );
    const dropArea = screen.getByText('select content');
    const img = new File(['a'], 'a.png', { type: 'image/png' });
    const txt = new File(['b'], 'b.txt', { type: 'text/plain' });
    fireEvent.drop(dropArea, {
      dataTransfer: {
        files: [img, txt],
        types: ['Files'],
      },
    });
    expect(setSelectedFiles).toHaveBeenCalledWith([img]);
  });

  it('handles dragOver event', () => {
    const setSelectedFiles = jest.fn();
    render(
      <Dialog
        open
        onOpenChange={() => {
          /* no-op */
        }}
      >
        <DialogContent>
          <SelectFile setSelectedFiles={setSelectedFiles} stage="Create new post" />
        </DialogContent>
      </Dialog>
    );
    const dropArea = screen.getByText('select content');

    // Test dragOver prevents default
    const dragOverEvent = new Event('dragover', { bubbles: true });
    const preventDefaultSpy = jest.spyOn(dragOverEvent, 'preventDefault');
    fireEvent(dropArea, dragOverEvent);
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('handles file input with no files', () => {
    const setSelectedFiles = jest.fn();
    render(
      <Dialog
        open
        onOpenChange={() => {
          /* no-op */
        }}
      >
        <DialogContent>
          <SelectFile setSelectedFiles={setSelectedFiles} stage="Create new post" />
        </DialogContent>
      </Dialog>
    );
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;

    // Test with null files
    fireEvent.change(input, { target: { files: null } });
    expect(setSelectedFiles).toHaveBeenCalledWith([]);
  });
});
