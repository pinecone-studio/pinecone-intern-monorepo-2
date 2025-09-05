import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { CropStage } from '@/components/create-post-dialog/CropStage';

describe('CropStage', () => {
  const Stages = ['Create new post', 'Edit', 'Caption', 'Creating'];

  beforeEach(() => {
    // mock URL.createObjectURL
    global.URL.createObjectURL = jest.fn(() => 'blob:http://localhost/mock') as unknown as typeof URL.createObjectURL;
  });

  it('renders preview and navigates images when multiple files', () => {
    const files = [new File(['a'], 'a.png', { type: 'image/png' }), new File(['b'], 'b.png', { type: 'image/png' })];
    const setFiles = jest.fn();
    render(<CropStage files={files} setFiles={setFiles} stage={Stages[1]} Stages={Stages} />);
    expect(screen.getByAltText('Preview 1')).toBeInTheDocument();
    const next = screen.getByText('›');
    fireEvent.click(next);
    const prev = screen.getByText('‹');
    fireEvent.click(prev);
  });

  it('shows thumb tray and allows remove/add', () => {
    const files = [new File(['a'], 'a.png', { type: 'image/png' })];
    const setFiles = jest.fn();
    render(<CropStage files={files} setFiles={setFiles} stage={Stages[1]} Stages={Stages} />);
    // open thumb tray
    const addButton = screen.getByRole('button', { name: '' });
    fireEvent.click(addButton);
  });

  it('renders with single image and no navigation', () => {
    const files = [new File(['a'], 'a.png', { type: 'image/png' })];
    const setFiles = jest.fn();
    render(<CropStage files={files} setFiles={setFiles} stage={Stages[1]} Stages={Stages} />);
    expect(screen.getByAltText('Preview 1')).toBeInTheDocument();
    expect(screen.queryByText('‹')).not.toBeInTheDocument();
    expect(screen.queryByText('›')).not.toBeInTheDocument();
  });

  it('handles thumbnail tray operations', () => {
    const files = [new File(['a'], 'a.png', { type: 'image/png' }), new File(['b'], 'b.png', { type: 'image/png' })];
    const setFiles = jest.fn();
    render(<CropStage files={files} setFiles={setFiles} stage={Stages[1]} Stages={Stages} />);

    // Open thumb tray
    const toggleButton = screen.getByRole('button', { name: '' });
    fireEvent.click(toggleButton);

    // Remove image
    const removeButton = screen.getByLabelText('Remove image 1');
    fireEvent.click(removeButton);
    expect(setFiles).toHaveBeenCalledWith([files[1]]);
  });

  it('adds more images via file input', () => {
    const files = [new File(['a'], 'a.png', { type: 'image/png' })];
    const setFiles = jest.fn();
    render(<CropStage files={files} setFiles={setFiles} stage={Stages[1]} Stages={Stages} />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const newFile = new File(['b'], 'b.png', { type: 'image/png' });

    fireEvent.change(input, { target: { files: [newFile] } });
    expect(setFiles).toHaveBeenCalledWith([...files, newFile]);
  });

  it('filters out non-image files', () => {
    const files = [new File(['a'], 'a.png', { type: 'image/png' })];
    const setFiles = jest.fn();
    render(<CropStage files={files} setFiles={setFiles} stage={Stages[1]} Stages={Stages} />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const imageFile = new File(['b'], 'b.png', { type: 'image/png' });
    const textFile = new File(['c'], 'c.txt', { type: 'text/plain' });

    fireEvent.change(input, { target: { files: [imageFile, textFile] } });
    expect(setFiles).toHaveBeenCalledWith([...files, imageFile]);
  });

  it('handles empty file selection', () => {
    const files = [new File(['a'], 'a.png', { type: 'image/png' })];
    const setFiles = jest.fn();
    render(<CropStage files={files} setFiles={setFiles} stage={Stages[1]} Stages={Stages} />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: null } });
    expect(setFiles).not.toHaveBeenCalled();
  });

  it('does not show thumb tray when stage is not Edit', () => {
    const files = [new File(['a'], 'a.png', { type: 'image/png' })];
    const setFiles = jest.fn();
    render(<CropStage files={files} setFiles={setFiles} stage={Stages[2]} Stages={Stages} />);

    // When stage is not Edit, no toggle button should be present
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.queryByAltText('Thumb 1')).not.toBeInTheDocument();
  });

  it('handles empty files array', () => {
    const setFiles = jest.fn();
    render(<CropStage files={[]} setFiles={setFiles} stage={Stages[1]} Stages={Stages} />);
    expect(screen.queryByAltText('Preview 1')).not.toBeInTheDocument();
  });

  it('clicks add more input via ref', () => {
    const files = [new File(['a'], 'a.png', { type: 'image/png' })];
    const setFiles = jest.fn();
    render(<CropStage files={files} setFiles={setFiles} stage={Stages[1]} Stages={Stages} />);

    // Open thumb tray
    const toggleButton = screen.getByRole('button', { name: '' });
    fireEvent.click(toggleButton);

    // Click add more button
    const addMoreButton = screen.getByLabelText('Add more images');
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const clickSpy = jest.spyOn(input, 'click');

    fireEvent.click(addMoreButton);
    expect(clickSpy).toHaveBeenCalled();
  });
});
