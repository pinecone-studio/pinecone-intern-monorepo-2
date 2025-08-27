import { demoImage } from '../../../src/components/userProfile/mock-images';

describe('Mock Images Utility', () => {
  it('should export demoImage', () => {
    expect(demoImage).toBeDefined();
  });

  it('should be a string value', () => {
    expect(typeof demoImage).toBe('string');
  });

  it('should not be empty', () => {
    expect(demoImage).not.toBe('');
    expect(demoImage.length).toBeGreaterThan(0);
  });
});
