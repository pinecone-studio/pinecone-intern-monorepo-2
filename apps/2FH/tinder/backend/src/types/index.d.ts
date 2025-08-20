export * from './swipe.types';
export * from './resolvers.types';
import { NextRequest } from 'next/server';

export type Context = {
  req: NextRequest;
};
