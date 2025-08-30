import '@testing-library/jest-dom';
// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {
    // Mock constructor
  }
  disconnect() {
    // Mock disconnect
  }
  observe() {
    // Mock observe
  }
  unobserve() {
    // Mock unobserve
  }
} as unknown as typeof IntersectionObserver;

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {
    // Mock constructor
  }
  disconnect() {
    // Mock disconnect
  }
  observe() {
    // Mock observe
  }
  unobserve() {
    // Mock unobserve
  }
} as unknown as typeof ResizeObserver;

// Mock scrollIntoView
Element.prototype.scrollIntoView = jest.fn();
