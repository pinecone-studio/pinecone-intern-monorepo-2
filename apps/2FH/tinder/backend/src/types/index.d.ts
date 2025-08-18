/* eslint-disable @typescript-eslint/ban-types */
// src/types/index.d.ts
import { NextRequest } from 'next/server';

export type Context = {
  req: NextRequest;
  // you can add more fields here later if needed
};
