import { stories, suggestions, posts } from '@/utils/fake-data';

describe('Mock Data Integrity', () => {
  it('stories should all have unique IDs and correct fields', () => {
    expect(stories.length).toBeGreaterThan(0);

    const ids = new Set();
    stories.forEach((story) => {
      // required fields
      expect(story).toHaveProperty('id');
      expect(story).toHaveProperty('username');
      expect(story).toHaveProperty('avatar');
      expect(story).toHaveProperty('hasStory');

      // unique id
      expect(ids.has(story.id)).toBe(false);
      ids.add(story.id);

      // type checks
      expect(typeof story.id).toBe('number');
      expect(typeof story.username).toBe('string');
      expect(typeof story.avatar).toBe('string');
      expect(typeof story.hasStory).toBe('boolean');
    });
  });

  it('suggestions should all have required fields', () => {
    expect(suggestions.length).toBeGreaterThan(0);

    const ids = new Set();
    suggestions.forEach((s) => {
      expect(s).toHaveProperty('id');
      expect(s).toHaveProperty('username');
      expect(s).toHaveProperty('description');
      expect(s).toHaveProperty('avatar');

      expect(ids.has(s.id)).toBe(false);
      ids.add(s.id);

      expect(typeof s.id).toBe('number');
      expect(typeof s.username).toBe('string');
      expect(typeof s.description).toBe('string');
      expect(typeof s.avatar).toBe('string');
    });
  });

  it('posts should have valid structure', () => {
    expect(posts.length).toBeGreaterThan(0);

    const ids = new Set();
    posts.forEach((post) => {
      expect(post).toHaveProperty('id');
      expect(post).toHaveProperty('username');
      expect(post).toHaveProperty('timeAgo');
      expect(post).toHaveProperty('image');
      expect(post).toHaveProperty('likes');
      expect(post).toHaveProperty('caption');
      expect(post).toHaveProperty('comments');

      expect(ids.has(post.id)).toBe(false);
      ids.add(post.id);

      expect(typeof post.id).toBe('number');
      expect(typeof post.username).toBe('string');
      expect(typeof post.timeAgo).toBe('string');
      expect(typeof post.image).toBe('string');
      expect(typeof post.likes).toBe('number');
      expect(typeof post.caption).toBe('string');
      expect(typeof post.comments).toBe('number');
    });
  });
});
