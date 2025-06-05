/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '*.svg' {
  const content: any;
  export const ReactComponent: any;
  export default content;
}


/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '*.svg' {
  const content: any;
  export const ReactComponent: any;
  export default content;
}

// 👇 Add this block to extend the Window interface
export {};

declare global {
  interface Window {
    Clerk?: {
      user?: {
        id: string;
      };
    };
  }
}
