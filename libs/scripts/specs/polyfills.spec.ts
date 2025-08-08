describe('polyfills', () => {
  let originalFile: typeof globalThis.File | undefined;

  beforeEach(() => {
    // Store the original File if it exists
    originalFile = (globalThis as { File?: typeof globalThis.File }).File;
    // Remove File from globalThis to simulate Node.js environment
    delete (globalThis as { File?: typeof globalThis.File }).File;
  });

  afterEach(() => {
    // Restore original File
    if (originalFile) {
      (globalThis as { File?: typeof globalThis.File }).File = originalFile;
    } else {
      delete (globalThis as { File?: typeof globalThis.File }).File;
    }
    // Clear require cache to ensure fresh import
    delete require.cache[require.resolve('../src/polyfills')];
  });

  it('should create File polyfill when File is not defined', () => {
    // Verify File is not defined initially
    expect((globalThis as { File?: typeof globalThis.File }).File).toBeUndefined();

    // Import the polyfills (this should create the File polyfill)
    require('../src/polyfills');

    // Verify File polyfill was created
    expect((globalThis as { File?: typeof globalThis.File }).File).toBeDefined();
    expect(typeof (globalThis as { File?: typeof globalThis.File }).File).toBe('function');
  });

  it('should not override File if it already exists', () => {
    // Create a mock File
    const mockFile = class MockFile {};
    (globalThis as { File?: typeof globalThis.File }).File = mockFile;

    // Import the polyfills
    require('../src/polyfills');

    // Verify the original File was not overridden
    expect((globalThis as { File?: typeof globalThis.File }).File).toBe(mockFile);
  });





  it('should create File polyfill with correct properties', async () => {
    // Import the polyfills
    const { FilePolyfill } = await import('../src/polyfills');

    // Test that we can create an instance
    const file = new FilePolyfill(['test content'], 'test.txt', { type: 'text/plain' });

    expect(file.name).toBe('test.txt');
    expect(file.type).toBe('text/plain');
    expect(typeof file.size).toBe('number');
    expect(typeof file.lastModified).toBe('number');
  });

  it('should create File polyfill with default values when options not provided', async () => {
    // Import the polyfills
    const { FilePolyfill } = await import('../src/polyfills');

    // Test that we can create an instance without options
    const file = new FilePolyfill(['test content'], 'test.txt');

    expect(file.name).toBe('test.txt');
    expect(file.type).toBe('');
    expect(typeof file.size).toBe('number');
    expect(typeof file.lastModified).toBe('number');
  });
}); 