// apps/2FH/tinder/backend/specs/resolvers/mutations/swipe-mutation.spec.ts
import { swipe } from '../../../src/resolvers/mutations/swipe-mutation';
import { swipe as swipeCore } from '../../../src/utils/swipe-core';

describe('swipe-mutation', () => {
  it('should re-export swipe function from swipe-core', () => {
    // Test that the re-export is working correctly
    expect(swipe).toBe(swipeCore);
    expect(typeof swipe).toBe('function');
  });

  it('should have the same function signature as swipe-core', () => {
    // Test that the function signature is preserved
    expect(swipe.length).toBe(swipeCore.length);
    expect(swipe.name).toBe(swipeCore.name);
  });
}); 