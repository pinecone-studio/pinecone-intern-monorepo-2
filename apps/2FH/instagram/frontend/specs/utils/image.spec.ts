import { getValidImageUrl } from '@/utils/image';

describe('image utility', () => {
  describe('getValidImageUrl', () => {
    it('should return the URL when it starts with http', () => {
      const result = getValidImageUrl('http://example.com/image.jpg', '/fallback.jpg');
      expect(result).toBe('http://example.com/image.jpg');
    });

    it('should return the URL when it starts with https', () => {
      const result = getValidImageUrl('https://example.com/image.jpg', '/fallback.jpg');
      expect(result).toBe('https://example.com/image.jpg');
    });

    it('should return the URL when it starts with /', () => {
      const result = getValidImageUrl('/local/image.jpg', '/fallback.jpg');
      expect(result).toBe('/local/image.jpg');
    });

    it('should return fallback when URL is undefined', () => {
      const result = getValidImageUrl(undefined, '/fallback.jpg');
      expect(result).toBe('/fallback.jpg');
    });

    it('should return fallback when URL is empty string', () => {
      const result = getValidImageUrl('', '/fallback.jpg');
      expect(result).toBe('/fallback.jpg');
    });

    it('should return fallback when URL does not start with http or /', () => {
      const result = getValidImageUrl('invalid-url', '/fallback.jpg');
      expect(result).toBe('/fallback.jpg');
    });

    it('should return fallback when URL starts with ftp', () => {
      const result = getValidImageUrl('ftp://example.com/image.jpg', '/fallback.jpg');
      expect(result).toBe('/fallback.jpg');
    });
  });
});
