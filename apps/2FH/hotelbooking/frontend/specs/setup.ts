import '@testing-library/jest-dom';

// Mock IntersectionObserver
(global as any).IntersectionObserver = class IntersectionObserver {
  constructor() {
    // Mock constructor
  }
  disconnect(): void {
    // Mock disconnect
  }
  observe(): void {
    // Mock observe
  }
  unobserve(): void {
    // Mock unobserve
  }
};

// Mock ResizeObserver
(global as any).ResizeObserver = class ResizeObserver {
  constructor() {
    // Mock constructor
  }
  disconnect(): void {
    // Mock disconnect
  }
  observe(): void {
    // Mock observe
  }
  unobserve(): void {
    // Mock unobserve
  }
};

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
