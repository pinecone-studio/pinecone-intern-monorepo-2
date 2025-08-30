export const dynamic = 'force-dynamic';

import { handler } from '../../../handler';
import { NextRequest, NextResponse } from 'next/server';

// Handle OPTIONS request for CORS preflight
export async function OPTIONS(_request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}

export { handler as GET, handler as POST };
