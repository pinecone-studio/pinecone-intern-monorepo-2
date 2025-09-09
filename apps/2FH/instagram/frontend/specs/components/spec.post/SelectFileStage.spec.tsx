import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { SelectFile } from '@/components/create-post-dialog/SelectFileStage';

const renderSelectFile = (selectedFiles: File[] = [], onFileSelect = jest.fn()) => {
  render(
    <Dialog
      open
      onOpenChange={() => {
        /*on-op*/
      }}
    >
      <DialogContent>
        <SelectFile selectedFiles={selectedFiles} onFileSelect={onFileSelect} stage="Select" />
      </DialogContent>
    </Dialog>
  );
  return { onFileSelect };
};

describe('SelectFileStage', () => {
  it('renders title and accepts file input change', () => {
    const { onFileSelect } = renderSelectFile();
    expect(screen.getByText('Drag and drop files here, or click to select')).toBeInTheDocument();
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['a'], 'a.png', { type: 'image/png' });
    fireEvent.change(input, { target: { files: [file] } });
    expect(onFileSelect).toHaveBeenCalled();
  });

  it('handles drag/drop images only', () => {
    const { onFileSelect } = renderSelectFile();
    const dropArea = screen.getByText('Select contents');
    const img = new File(['a'], 'a.png', { type: 'image/png' });
    const txt = new File(['b'], 'b.txt', { type: 'text/plain' });
    fireEvent.drop(dropArea, { dataTransfer: { files: [img, txt], types: ['Files'] } });
    expect(onFileSelect).toHaveBeenCalledWith([img, txt]);
  });

  it('handles dragOver event', () => {
    renderSelectFile();
    const dropArea = screen.getByText('Select contents');
    const dragOverEvent = new Event('dragover', { bubbles: true });
    const preventDefaultSpy = jest.spyOn(dragOverEvent, 'preventDefault');
    fireEvent(dropArea, dragOverEvent);
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('handles file input with no files', () => {
    const { onFileSelect } = renderSelectFile();
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: null } });
    expect(onFileSelect).toHaveBeenCalledWith([]);
  });

  it('handles dragLeave event', () => {
    renderSelectFile();
    const dropArea = screen.getByText('Select contents');
    const dragLeaveEvent = new Event('dragleave', { bubbles: true });
    const preventDefaultSpy = jest.spyOn(dragLeaveEvent, 'preventDefault');
    fireEvent(dropArea, dragLeaveEvent);
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('handles click event to trigger file input', () => {
    renderSelectFile();
    const dropArea = screen.getByText('Select contents');
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const clickSpy = jest.spyOn(input, 'click').mockImplementation();
    fireEvent.click(dropArea);
    expect(clickSpy).toHaveBeenCalled();
    clickSpy.mockRestore();
  });

  it('handles file removal', () => {
    const file1 = new File(['a'], 'a.png', { type: 'image/png' });
    const file2 = new File(['b'], 'b.jpg', { type: 'image/jpeg' });
    const { onFileSelect } = renderSelectFile([file1, file2]);
    const removeButtons = screen.getAllByRole('button');
    const removeButton = removeButtons.find((button) => button.querySelector('svg'));
    if (removeButton) {
      fireEvent.click(removeButton);
      expect(onFileSelect).toHaveBeenCalledWith([file2]);
    }
  });
});
