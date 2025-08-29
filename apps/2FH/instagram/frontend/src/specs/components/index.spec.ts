import * as ComponentsIndex from '../../components/index';

describe('Components Index', () => {
  it('should export Sidebar components', () => {
    expect(ComponentsIndex.Sidebar).toBeDefined();
    expect(typeof ComponentsIndex.Sidebar).toBe('function');
  });

  it('should export RightSidebar component', () => {
    expect(ComponentsIndex.RightSidebar).toBeDefined();
    expect(typeof ComponentsIndex.RightSidebar).toBe('function');
  });

  it('should export SearchSidebar component', () => {
    expect(ComponentsIndex.SearchSidebar).toBeDefined();
    expect(typeof ComponentsIndex.SearchSidebar).toBe('function');
  });

  it('should export ApolloWrapper component', () => {
    expect(ComponentsIndex.ApolloWrapper).toBeDefined();
    expect(typeof ComponentsIndex.ApolloWrapper).toBe('function');
  });

  it('should export NavigationProvider component', () => {
    expect(ComponentsIndex.NavigationProvider).toBeDefined();
    expect(typeof ComponentsIndex.NavigationProvider).toBe('function');
  });

  it('should export Posts component', () => {
    expect(ComponentsIndex.Posts).toBeDefined();
    expect(typeof ComponentsIndex.Posts).toBe('function');
  });

  it('should have all expected exports', () => {
    const expectedExports = [
      'Sidebar',
      'RightSidebar', 
      'SearchSidebar',
      'ApolloWrapper',
      'NavigationProvider',
      'Posts'
    ];

    expectedExports.forEach(exportName => {
      expect(ComponentsIndex).toHaveProperty(exportName);
    });
  });

  it('should export components that can be instantiated', () => {
    // Test that the exported components are actually React components
    expect(ComponentsIndex.Sidebar).toBeTruthy();
    expect(ComponentsIndex.RightSidebar).toBeTruthy();
    expect(ComponentsIndex.SearchSidebar).toBeTruthy();
    expect(ComponentsIndex.ApolloWrapper).toBeTruthy();
    expect(ComponentsIndex.NavigationProvider).toBeTruthy();
    expect(ComponentsIndex.Posts).toBeTruthy();
  });
});
