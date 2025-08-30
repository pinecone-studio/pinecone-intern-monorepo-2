import * as providerComponents from '../../../../src/components/providers';

describe('Providers Components Index', () => {
  it('should export ApolloWrapper', () => {
    expect(providerComponents).toHaveProperty('ApolloWrapper');
  });
}); 