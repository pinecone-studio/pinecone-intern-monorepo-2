import { handler } from '../../../handler';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

const allowedOrigins = ['http://localhost:4201', 'https://tinder-frontend-prod.vercel.app'];

function getAllowedOrigin(requestOrigin: string | null) {
  if (!requestOrigin) return allowedOrigins[0];
  return allowedOrigins.includes(requestOrigin) ? requestOrigin : allowedOrigins[0];
}

export async function OPTIONS(req: NextRequest) {
  const origin = getAllowedOrigin(req.headers.get('origin'));
  
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, clerkid',
    },
  });
}

export async function POST(req: NextRequest) {
  const response = await handler(req);
  const origin = getAllowedOrigin(req.headers.get('origin'));

  // Set CORS headers
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Allow-Origin', origin);
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, clerkid');

  return response;
}

