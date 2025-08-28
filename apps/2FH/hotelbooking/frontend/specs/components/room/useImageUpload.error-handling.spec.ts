import '@testing-library/jest-dom';
import { renderHook, act } from '@testing-library/react';
import { useImageUpload } from '../../../src/components/room/useImageUpload';

// Mock fetch globally
global.fetch = jest.fn();
global.URL.createObjectURL = jest.fn(() => 'https://example.com/mocked-url');

describe('useImageUpload Error Handling', () => {
  const mockOnSave = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  it('should handle upload response not ok (line 19)', async () => {
    const { result } = renderHook(() => useImageUpload(mockOnSave, mockOnClose));

    // Mock fetch to return a failed response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 400,
    });

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

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    await act(async () => {
      await result.current.handleSave();
    });

    expect(consoleSpy).toHaveBeenCalledWith('Failed to upload test.jpg:', expect.any(Error));
    expect(mockOnSave).toHaveBeenCalledWith([]);

    consoleSpy.mockRestore();
  });

  it('should handle individual file upload failures (line 51)', async () => {
    const { result } = renderHook(() => useImageUpload(mockOnSave, mockOnClose));

    const mockFile1 = new File(['test1'], 'test1.jpg', { type: 'image/jpeg' });
    const mockFile2 = new File(['test2'], 'test2.jpg', { type: 'image/jpeg' });

    act(() => {
      result.current.handleFileSelect({
        length: 2,
        item: (index: number) => [mockFile1, mockFile2][index],
        [Symbol.iterator]: function* () {
          yield mockFile1;
          yield mockFile2;
        },
      } as FileList);
    });

    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error')).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ secure_url: 'https://example.com/image2.jpg' }), // eslint-disable-line camelcase
    });

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    await act(async () => {
      await result.current.handleSave();
    });

    expect(consoleSpy).toHaveBeenCalledWith('Failed to upload test1.jpg:', expect.any(Error));
    expect(mockOnSave).toHaveBeenCalledWith(['https://example.com/image2.jpg']);

    consoleSpy.mockRestore();
  });

  it('should handle general upload failure (line 58)', async () => {
    const mockOnSaveWithError = jest.fn().mockImplementation(() => {
      throw new Error('Save callback error');
    });

    const { result } = renderHook(() => useImageUpload(mockOnSaveWithError, mockOnClose));

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
      json: () => Promise.resolve({ secure_url: 'https://example.com/image.jpg' }), // eslint-disable-line camelcase
    });

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    await act(async () => {
      await result.current.handleSave();
    });

    expect(consoleSpy).toHaveBeenCalledWith('Upload failed:', expect.any(Error));

    consoleSpy.mockRestore();
  });
});
