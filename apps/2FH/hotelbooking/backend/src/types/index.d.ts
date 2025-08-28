/* eslint-disable @typescript-eslint/ban-types */
import type { NextRequest } from 'next/server';
import type { AuthenticatedUser } from '../middlewares/authenticate';

export type Context = {
  req: NextRequest;
  user?: AuthenticatedUser | null;
};
