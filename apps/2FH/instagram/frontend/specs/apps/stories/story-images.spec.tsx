import * as storyImages from '../../../src/components/stories/story-images';

describe('Story Images', () => {
  test('exports all required story images', () => {
    expect(storyImages.storyImage).toBeDefined();
    expect(storyImages.storyImage2).toBeDefined();
    expect(storyImages.storyImage3).toBeDefined();
    expect(storyImages.storyImage4).toBeDefined();
    expect(storyImages.storyImage5).toBeDefined();
    expect(storyImages.storyImage6).toBeDefined();
    expect(storyImages.storyImage7).toBeDefined();
  });

  test('exports all required avatar images', () => {
    expect(storyImages.avatar).toBeDefined();
    expect(storyImages.avatar2).toBeDefined();
    expect(storyImages.avatar3).toBeDefined();
    expect(storyImages.avatar4).toBeDefined();
    expect(storyImages.avatar5).toBeDefined();
  });

  test('all exports are strings', () => {
    const allExports = Object.values(storyImages);
    allExports.forEach((value) => {
      expect(typeof value).toBe('string');
      expect(value.length).toBeGreaterThan(0);
    });
  });
});
