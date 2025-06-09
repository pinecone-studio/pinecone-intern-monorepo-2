/* eslint-disable camelcase */

import { uploadImageToCloudinary } from './cloudinary-upload';

describe('uploadImageToCloudinary', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    jest.resetAllMocks();
  });

  function createMockFile(): File {
    return new File(['dummy content'], 'test.png', { type: 'image/png' });
  }

  it('uploads file and returns secure URL', async () => {
    const mockUrl = 'https://cloudinary.com/secure/test.png';

    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue({ secure_url: mockUrl }),
    });

    const file = createMockFile();
    const result = await uploadImageToCloudinary(file);

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.cloudinary.com/v1_1/ddcj2mdsk/upload',
      expect.objectContaining({
        method: 'POST',
        body: expect.any(FormData),
      })
    );

    expect(result).toBe(mockUrl);
  });

  it('returns undefined if secure_url is missing', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue({}),
    });

    const file = createMockFile();
    const result = await uploadImageToCloudinary(file);

    expect(result).toBeUndefined();
  });

  it('throws if fetch fails', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    const file = createMockFile();
    await expect(uploadImageToCloudinary(file)).rejects.toThrow('Network error');
  });

  it('throws if response.json throws', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockRejectedValue(new Error('Invalid JSON')),
    });

    const file = createMockFile();
    await expect(uploadImageToCloudinary(file)).rejects.toThrow('Invalid JSON');
  });

  it('sends correct FormData fields', async () => {
    let formData: FormData | undefined;
    (global.fetch as jest.Mock).mockImplementation((_url, options) => {
      formData = options.body as FormData;
      return Promise.resolve({
        json: jest.fn().mockResolvedValue({ secure_url: 'mock' }),
      });
    });

    const file = createMockFile();
    await uploadImageToCloudinary(file);

    expect(formData).toBeInstanceOf(FormData);
    if (formData) {
      expect(formData.get('file')).toBe(file);
      expect(formData.get('upload_preset')).toBe('your_upload_preset_here');
    }
  });

  it('handles non-File input gracefully', async () => {
    // @ts-expect-error: Testing invalid input handling
    await expect(uploadImageToCloudinary(undefined)).rejects.toThrow('Invalid file input');
  });
});
