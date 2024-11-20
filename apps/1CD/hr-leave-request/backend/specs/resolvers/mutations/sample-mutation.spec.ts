import { sampleMutation } from '../../../src/resolvers/mutations';

describe('sampleMutation', () => {
  it('should return "Hello sample mutation"', () => {
    const result = sampleMutation();
    expect(result).toBe('Hello sample mutation');
  });
});
