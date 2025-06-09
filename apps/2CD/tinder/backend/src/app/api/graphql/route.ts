import { handler } from '../../../handler';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

const allowedOrigins = ['http://localhost:4201', 'https://tinder-frontend-prod.vercel.app'];

function getAllowedOrigin(requestOrigin: string | null) {
  if (!requestOrigin) return ''; 
  return allowedOrigins.includes(requestOrigin) ? requestOrigin : '';
}

export async function OPTIONS(req: NextRequest) {
  const origin = getAllowedOrigin(req.headers.get('origin'));

  const headers: HeadersInit = {
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, clerkid',
  };

  if (origin) {
    headers['Access-Control-Allow-Origin'] = origin;
  }

  return new Response(null, {
    status: 204,
    headers,
  });
}


export async function POST(req: NextRequest) {
  const response = await handler(req);
  const origin = getAllowedOrigin(req.headers.get('origin'));

  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, clerkid');

  if (origin) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }

  return response;
}

