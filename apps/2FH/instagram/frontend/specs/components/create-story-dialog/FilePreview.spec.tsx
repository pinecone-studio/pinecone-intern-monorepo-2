// apps/2FH/instagram/frontend/src/specs/components/FilePreview.spec.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FilePreview } from '@/components/create-story-dialog/FilePreview';

describe('FilePreview', () => {
  const mockOnRemove = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders image preview with provided src', () => {
    const fakeFile = new File(['test'], 'test.png', { type: 'image/png' });
    render(<FilePreview preview="http://example.com/preview.png" file={fakeFile} onRemove={mockOnRemove} />);

    const img = screen.getByAltText('preview') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain('http://example.com/preview.png');
  });

  it('displays file name and size', () => {
    const fakeFile = new File(['hello world'], 'hello.txt', { type: 'text/plain' });

    render(<FilePreview preview="preview-url" file={fakeFile} onRemove={mockOnRemove} />);

    expect(screen.getByText(/File: hello.txt/)).toBeInTheDocument();
    expect(screen.getByText(/Size: /)).toBeInTheDocument();
  });

  it('handles null file gracefully', () => {
    render(<FilePreview preview="preview-url" file={null} onRemove={mockOnRemove} />);

    expect(screen.getByText(/File:/)).toHaveTextContent('File:');
    expect(screen.getByText(/Size:/)).toHaveTextContent('Size: 0.0KB');
  });

  it('calls onRemove when X button is clicked', () => {
    const fakeFile = new File(['test'], 'test.png', { type: 'image/png' });

    render(<FilePreview preview="preview-url" file={fakeFile} onRemove={mockOnRemove} />);

    const removeButton = screen.getByRole('button');
    fireEvent.click(removeButton);

    expect(mockOnRemove).toHaveBeenCalledTimes(1);
  });
});
