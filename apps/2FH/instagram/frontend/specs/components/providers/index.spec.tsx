import '@testing-library/jest-dom';
import { ApolloWrapper } from '../../../src/components/providers';
import * as ProvidersIndex from '../../../src/components/providers';

describe('Providers Index', () => {
  it('should export ApolloWrapper', async () => {
    const providersModule = await import('../../../src/components/providers');
    expect(providersModule.ApolloWrapper).toBeDefined();
  });

  it('should have correct module structure', async () => {
    const providersModule = await import('../../../src/components/providers');
    expect(typeof providersModule.ApolloWrapper).toBe('function');
  });

  it('should export ApolloWrapper as named export', () => {
    expect(ApolloWrapper).toBeDefined();
    expect(typeof ApolloWrapper).toBe('function');
  });

  it('should re-export ApolloWrapper correctly', () => {
    expect(ProvidersIndex.ApolloWrapper).toBeDefined();
    expect(ProvidersIndex.ApolloWrapper).toBe(ApolloWrapper);
  });

  it('should have all expected exports', () => {
    const namedExports = Object.keys(ProvidersIndex);
    expect(namedExports).toContain('ApolloWrapper');
    expect(namedExports.length).toBeGreaterThan(0);
  });

  it('should properly import and use the index file', () => {
    expect(() => ProvidersIndex).not.toThrow();
    expect(ProvidersIndex).toBeDefined();
  });
});
