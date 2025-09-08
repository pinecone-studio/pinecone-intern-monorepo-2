import '@testing-library/jest-dom';
import { renderHook, act } from '@testing-library/react';
import { useImageUpload } from '../../../src/components/room/useImageUpload';

// Mock fetch globally
global.fetch = jest.fn();
global.URL.createObjectURL = jest.fn(() => 'https://example.com/mocked-url');

describe('useImageUpload Basic Functionality', () => {
  const mockOnSave = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  it('should handle file selection', () => {
    const { result } = renderHook(() => useImageUpload(mockOnSave, mockOnClose));

    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    act(() => {
      result.current.handleFileSelect({
        length: 1,
        item: () => mockFile,
        [Symbol.iterator]: function* () {
          yield mockFile;
        },
      } as FileList);
    });

    expect(result.current.selectedFiles).toHaveLength(1);
    expect(result.current.selectedFiles[0]).toBe(mockFile);
  });

  it('should handle file removal', () => {
    const { result } = renderHook(() => useImageUpload(mockOnSave, mockOnClose));

    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    act(() => {
      result.current.handleFileSelect({
        length: 1,
        item: () => mockFile,
        [Symbol.iterator]: function* () {
          yield mockFile;
        },
      } as FileList);
    });

    expect(result.current.selectedFiles).toHaveLength(1);

    act(() => {
      result.current.removeFile(0);
    });

    expect(result.current.selectedFiles).toHaveLength(0);
  });

  it('should handle successful upload', async () => {
    const { result } = renderHook(() => useImageUpload(mockOnSave, mockOnClose));

    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    act(() => {
      result.current.handleFileSelect({
        length: 1,
        item: () => mockFile,
        [Symbol.iterator]: function* () {
          yield mockFile;
        },
      } as FileList);
    });

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      // eslint-disable-next-line camelcase
      json: () => Promise.resolve({ secure_url: 'https://example.com/image.jpg' }),
    });

    await act(async () => {
      await result.current.handleSave();
    });

    expect(mockOnSave).toHaveBeenCalledWith(['https://example.com/image.jpg']);
    expect(mockOnClose).toHaveBeenCalled();
    expect(result.current.selectedFiles).toHaveLength(0);
  });

  it('should handle close action', () => {
    const { result } = renderHook(() => useImageUpload(mockOnSave, mockOnClose));

    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    act(() => {
      result.current.handleFileSelect({
        length: 1,
        item: () => mockFile,
        [Symbol.iterator]: function* () {
          yield mockFile;
        },
      } as FileList);
    });
    expect(result.current.selectedFiles).toHaveLength(1);
    act(() => {
      result.current.handleClose();
    });
    expect(result.current.selectedFiles).toHaveLength(0);
    expect(mockOnClose).toHaveBeenCalled();
  });
  it('should return early if no files selected', async () => {
    const { result } = renderHook(() => useImageUpload(mockOnSave, mockOnClose));

    await act(async () => {
      await result.current.handleSave();
    });
    expect(mockOnSave).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });
  it('should handle null files in handleFileSelect', () => {
    const { result } = renderHook(() => useImageUpload(mockOnSave, mockOnClose));

    act(() => {
      result.current.handleFileSelect(null);
    });

    expect(result.current.selectedFiles).toHaveLength(0);
  });
  it('should filter non-image files', () => {
    const { result } = renderHook(() => useImageUpload(mockOnSave, mockOnClose));

    const mockImageFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const mockTextFile = new File(['test'], 'test.txt', { type: 'text/plain' });

    act(() => {
      result.current.handleFileSelect({
        length: 2,
        item: (index: number) => [mockImageFile, mockTextFile][index],
        [Symbol.iterator]: function* () {
          yield mockImageFile;
          yield mockTextFile;
        },
      } as FileList);
    });

    expect(result.current.selectedFiles).toHaveLength(1);
    expect(result.current.selectedFiles[0]).toBe(mockImageFile);
  });

  it('should generate preview URL', () => {
    const { result } = renderHook(() => useImageUpload(mockOnSave, mockOnClose));

    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const previewUrl = result.current.getPreviewUrl(mockFile);

    expect(previewUrl).toBe('https://example.com/mocked-url');
  });
});
