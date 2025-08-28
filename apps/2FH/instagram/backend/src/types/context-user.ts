import { NextRequest } from 'next/server';

export type ContextUser = {
  req: NextRequest;
  userId?: string;
}