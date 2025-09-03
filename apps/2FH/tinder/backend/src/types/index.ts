export * from './swipe-types';
import { NextRequest } from 'next/server';

export type Context = {
  req: NextRequest;
};
