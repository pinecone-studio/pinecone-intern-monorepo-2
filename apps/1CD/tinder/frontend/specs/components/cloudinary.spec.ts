/* eslint-disable camelcase */

import { uploadFilesInCloudinary } from '@/utils/cloudinary';
import { expect } from '@jest/globals';

global.fetch = jest.fn();

global.File = jest.fn().mockImplementation((fileBits: BlobPart[], fileName: string, options: FilePropertyBag) => {
  return {
    ...options,
    size: fileBits.length,
    name: fileName,
    type: options.type,
    lastModified: Date.now(),
  };
});

describe('uploadFilesInCloudinary', () => {
  beforeAll(() => {
    process.env.NEXT_PUBLIC_CLOUD_NAME = 'dkylvahwz';
    process.env.NEXT_PUBLIC_UPLOAD_PRESET = 'tinder_image';
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should upload file and return the secure URL', async () => {
    const mockFile = new File(['mockBlob'], 'mock-image.jpg', { type: 'image/jpg' });

    const mockResponse = {
      secure_url: 'https://res.cloudinary.com/test/image/upload/vXy4Tg2D/sample.jpg',
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await uploadFilesInCloudinary(mockFile);

    expect(result).toBe(mockResponse.secure_url);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('https://api.cloudinary.com/v1_1/dkylvahwz/upload'),
      expect.objectContaining({
        method: 'POST',
        body: expect.any(FormData),
      })
    );
  });

  it('should handle error and return an empty string if upload fails', async () => {
    const mockFile = new File(['mockBlob'], 'mock-image.jpg', { type: 'image/jpg' });

    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Upload failed'));

    const result = await uploadFilesInCloudinary(mockFile);

    expect(fetch).toHaveBeenCalled();

    expect(result).toBe('');
  });
  it('should handle non-OK responses and return an empty string', async () => {
    const mockFile = new File(['mockBlob'], 'mock-image.jpg', { type: 'image/jpg' });

    const mockResponse = { error: { message: 'Cloudinary error' } };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      statusText: 'Bad Request',
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await uploadFilesInCloudinary(mockFile);

    expect(fetch).toHaveBeenCalled();
    expect(result).toBe('');
  });

  it('should log error when upload fails', async () => {
    const mockFile = new File(['mockBlob'], 'mock-image.jpg', { type: 'image/jpg' });

    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Upload failed'));

    await uploadFilesInCloudinary(mockFile);
  });
});
