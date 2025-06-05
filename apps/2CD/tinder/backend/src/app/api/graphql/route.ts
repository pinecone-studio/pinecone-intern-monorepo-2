import { handler } from '../../../handler';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, userid, clerkid',
    },
  });
}

export async function POST(req: NextRequest) {
  const response = await handler(req);

  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, userid, clerkid');
  response.headers.set('Access-Control-Allow-Credentials', 'true');

  return response;
}

