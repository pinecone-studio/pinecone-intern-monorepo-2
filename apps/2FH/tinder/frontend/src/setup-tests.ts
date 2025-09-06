import '@testing-library/jest-dom';

// Mock Next.js Image component
jest.mock('next/image', () => ({
    __esModule: true,
    default: function MockImage(props: any) {
        // eslint-disable-line @typescript-eslint/no-explicit-any
        // For testing, we'll use the original src but ensure it's valid for Next.js
        const validProps = {
            ...props,
            // Keep original src for test assertions, but ensure it's valid for Next.js
            src: props.src || '/placeholder.jpg',
        };
        return jest.requireActual('react').createElement('img', validProps);
    },
}));

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => 'https://example.com/mocked-url');

// Mock console.warn to suppress React warnings in tests
const originalWarn = console.warn;
beforeAll(() => {
    console.warn = (...args: any[]) => {
        if (typeof args[0] === 'string' && args[0].includes('Warning: An update to') && args[0].includes('was not wrapped in act')) {
            return;
        }
        originalWarn.call(console, ...args);
    };
});

afterAll(() => {
    console.warn = originalWarn;
});