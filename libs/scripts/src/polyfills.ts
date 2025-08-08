// Polyfill for File global that undici expects

// Create a minimal File polyfill for Node.js
class FilePolyfill {
  name: string;
  size: number;
  type: string;
  lastModified: number;

  constructor(bits: Array<{ size?: number; length?: number } | string>, filename: string, options?: { type?: string; lastModified?: number }) {
    this.name = filename;
    this.size = bits.reduce((acc, bit) => {
      if (typeof bit === 'string') {
        return acc + bit.length;
      }
      return acc + (bit.size || bit.length || 0);
    }, 0);
    this.type = options?.type || '';
    this.lastModified = options?.lastModified || Date.now();
  }
}

// Always set the polyfill if File is not defined
if (typeof globalThis.File === 'undefined') {
  (globalThis as { File?: typeof FilePolyfill }).File = FilePolyfill;
}

export { FilePolyfill }; 