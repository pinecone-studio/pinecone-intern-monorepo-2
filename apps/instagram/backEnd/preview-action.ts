import { File } from "undici";
  // @ts-expect-error - File is not available in Node.js global scope, need to polyfill for undici
  global.File = File;
