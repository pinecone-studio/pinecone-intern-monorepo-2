import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { ApolloWrapper } from '../../../src/components/providers/ApolloWrapper';

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

jest.mock('@apollo/client', () => ({
  HttpLink: jest.fn().mockImplementation(() => ({})),
}));

jest.mock('@apollo/client/link/context', () => ({
  setContext: jest.fn().mockImplementation((contextFn) => {
    contextFn({}, { headers: {} });
    return {
      concat: jest.fn().mockReturnValue({}),
    };
  }),
}));

jest.mock('@apollo/experimental-nextjs-app-support', () => ({
  ApolloNextAppProvider: ({ children, makeClient }: { children: React.ReactNode; makeClient: () => void }) => {
    if (makeClient) {
      makeClient();
    }
    return <div data-testid="apollo-provider">{children}</div>;
  },
  ApolloClient: jest.fn().mockImplementation(() => ({})),
  InMemoryCache: jest.fn().mockImplementation(() => ({})),
}));

describe('ApolloWrapper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('should render successfully with children', () => {
    const TestChild = () => <div data-testid="test-child">Test Child</div>;
    
    render(
      <ApolloWrapper>
        <TestChild />
      </ApolloWrapper>
    );

    expect(document.querySelector('[data-testid="apollo-provider"]')).toBeTruthy();
    expect(document.querySelector('[data-testid="test-child"]')).toBeTruthy();
  });

  it('should wrap children with ApolloNextAppProvider', () => {
    const TestChild = () => <div>Test</div>;
    
    const { container } = render(
      <ApolloWrapper>
        <TestChild />
      </ApolloWrapper>
    );

    expect(container.querySelector('[data-testid="apollo-provider"]')).toBeTruthy();
  });

  it('should render without errors when no children provided', () => {
    expect(() => render(<ApolloWrapper />)).not.toThrow();
  });

  it('should handle multiple children', () => {
    render(
      <ApolloWrapper>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
      </ApolloWrapper>
    );

    expect(document.querySelector('[data-testid="child-1"]')).toBeTruthy();
    expect(document.querySelector('[data-testid="child-2"]')).toBeTruthy();
  });

  it('should create Apollo client with proper configuration and handle localStorage', () => {
    const TestChild = () => <div data-testid="test-child">Test</div>;
    
    render(
      <ApolloWrapper>
        <TestChild />
      </ApolloWrapper>
    );

    expect(localStorageMock.getItem.mock.calls.length).toBeGreaterThan(0);
    expect(localStorageMock.getItem.mock.calls[0][0]).toBe('token');
  });

  it('should handle token from localStorage', () => {
    localStorageMock.getItem.mockReturnValue('test-token');
    
    const TestChild = () => <div data-testid="test-child">Test</div>;
    
    render(
      <ApolloWrapper>
        <TestChild />
      </ApolloWrapper>
    );

    expect(localStorageMock.getItem.mock.calls.length).toBeGreaterThan(0);
    expect(localStorageMock.getItem.mock.calls[0][0]).toBe('token');
  });
});