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
    delete require.cache[require.resolve('./polyfills')];
  });

  it('should create File polyfill when File is not defined', () => {
    // Verify File is not defined initially
    expect((globalThis as { File?: typeof globalThis.File }).File).toBeUndefined();

    // Import the polyfills (this should create the File polyfill)
    require('./polyfills');

    // Verify File polyfill was created
    expect((globalThis as { File?: typeof globalThis.File }).File).toBeDefined();
    expect(typeof (globalThis as { File?: typeof globalThis.File }).File).toBe('function');
  });

  it('should not override File if it already exists', () => {
    // Create a mock File
    const mockFile = class MockFile {};
    (globalThis as { File?: typeof globalThis.File }).File = mockFile;

    // Import the polyfills
    require('./polyfills');

    // Verify the original File was not overridden
    expect((globalThis as { File?: typeof globalThis.File }).File).toBe(mockFile);
  });

  it('should handle case when File already exists in global scope', () => {
    // Create a mock File
    const mockFile = class MockFile {};
    (globalThis as { File?: typeof globalThis.File }).File = mockFile;
    
    // Clear require cache to ensure fresh import
    delete require.cache[require.resolve('./polyfills')];
    
    // Import the polyfills again
    require('./polyfills');

    // Verify the original File was not overridden
    expect((globalThis as { File?: typeof globalThis.File }).File).toBe(mockFile);
  });





  it('should create File polyfill with correct properties', async () => {
    // Import the polyfills
    const { FilePolyfill } = await import('./polyfills');

    // Test that we can create an instance
    const file = new FilePolyfill(['test content'], 'test.txt', { type: 'text/plain' });

    expect(file.name).toBe('test.txt');
    expect(file.type).toBe('text/plain');
    expect(typeof file.size).toBe('number');
    expect(typeof file.lastModified).toBe('number');
  });

  it('should create File polyfill with default values when options not provided', async () => {
    // Import the polyfills
    const { FilePolyfill } = await import('./polyfills');

    // Test that we can create an instance without options
    const file = new FilePolyfill(['test content'], 'test.txt');

    expect(file.name).toBe('test.txt');
    expect(file.type).toBe('');
    expect(typeof file.size).toBe('number');
    expect(typeof file.lastModified).toBe('number');
  });

  it('should handle mixed content types in FilePolyfill constructor', async () => {
    // Import the polyfills
    const { FilePolyfill } = await import('./polyfills');

    // Test with mixed content types (string and object with size/length)
    const file = new FilePolyfill([
      'test content',
      { size: 10 },
      { length: 5 },
      'more content'
    ], 'test.txt', { type: 'text/plain', lastModified: 123456789 });

    expect(file.name).toBe('test.txt');
    expect(file.type).toBe('text/plain');
    expect(file.size).toBe(39); // 'test content' (12) + 10 + 5 + 'more content' (12) = 39
    expect(file.lastModified).toBe(123456789);
  });

  it('should handle empty bits array in FilePolyfill constructor', async () => {
    // Import the polyfills
    const { FilePolyfill } = await import('./polyfills');

    // Test with empty bits array
    const file = new FilePolyfill([], 'empty.txt');

    expect(file.name).toBe('empty.txt');
    expect(file.type).toBe('');
    expect(file.size).toBe(0);
    expect(typeof file.lastModified).toBe('number');
  });

  it('should handle bits with undefined size and length properties', async () => {
    // Import the polyfills
    const { FilePolyfill } = await import('./polyfills');

    // Test with bits that have undefined size and length
    const file = new FilePolyfill([
      { size: undefined, length: undefined },
      { size: null, length: null },
      { size: 0, length: 0 }
    ], 'test.txt');

    expect(file.name).toBe('test.txt');
    expect(file.type).toBe('');
    expect(file.size).toBe(0); // All bits have falsy values, so size should be 0
    expect(typeof file.lastModified).toBe('number');
  });
}); 