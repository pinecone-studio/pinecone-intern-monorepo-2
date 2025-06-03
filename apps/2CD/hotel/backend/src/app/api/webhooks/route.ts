/* eslint-disable camelcase */
import { NextRequest } from 'next/server';
import { User } from 'src/models/user';
import { connectToDb } from 'src/utils/connect-to-db';
connectToDb();
type EmailAddress = { email_address: string };

async function handleUserCreated(id: string, email_addresses: EmailAddress[] | undefined, username: string | null, first_name: string | null, last_name: string | null) {
  const email = email_addresses && email_addresses.length > 0 ? email_addresses[0].email_address : '';
  const newUser = new User({
    email,
    username: username || null,
    clerkId: id,
    firstName: first_name,
    lastName: last_name,
  });
  await newUser.save();
  return new Response('User created in Mongodb successfully', { status: 201 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, email_addresses, username, first_name, last_name } = body.data || {};
    const type: string = body.type;
    if (type === 'user.created') {
      return await handleUserCreated(id, email_addresses, username, first_name, last_name);
    }
    return new Response('Webhook received', { status: 200 });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error verifying webhook', { status: 400 });
  }
}
