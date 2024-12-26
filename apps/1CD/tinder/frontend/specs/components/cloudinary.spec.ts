/* eslint-disable camelcase */

import { uploadFilesInCloudinary } from '@/utils/cloudinary';
import { expect } from '@jest/globals';

global.fetch = jest.fn();

global.File = jest.fn().mockImplementation((...args) => {
  return {
    size: args[0].length,
    name: args[1],
    type: args[2],
    lastModified: Date.now(),
    ...args,
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
  });

  it('should handle error and return an empty string if upload fails', async () => {
    const mockFile = new File(['mockBlob'], 'mock-image.jpg', { type: 'image/jpg' });

    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Upload failed'));

    const result = await uploadFilesInCloudinary(mockFile);

    expect(fetch).toHaveBeenCalled();

    expect(result).toBe('');
  });
});
