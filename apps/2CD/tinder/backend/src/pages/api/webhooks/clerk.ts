import type { NextApiRequest, NextApiResponse } from 'next';
import { WebhookEvent } from '@clerk/nextjs/server';
import { connectToDb } from '../../../utils/connect-to-db';
import User from '../../../models/user';

type ClerkUserData = {
  id: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  email_addresses?: { email_address: string }[];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Зөвхөн POST хүсэлтийг хүлээн авна' });
  }

  try {
    await connectToDb();
    const evt = req.body as WebhookEvent;
    return await processWebhookEvent(evt, res);
  } catch (error) {
    console.error('Clerk webhook handler алдаа:', error);
    return res.status(500).json({ message: 'Алдаа гарлаа' });
  }
}

async function processWebhookEvent(evt: WebhookEvent, res: NextApiResponse) {
  const data = evt.data as ClerkUserData;

  switch (evt.type) {
    case 'user.created':
    case 'user.updated':
      return await handleUserUpsert(data, res);
    case 'user.deleted':
      return await handleUserDelete(data, res);
    default:
      console.warn('event:', evt.type);
      return res.status(200).json({ message: 'Танигдаагүй event төрөл' });
  }
}

async function handleUserUpsert(data: ClerkUserData, res: NextApiResponse) {
  const id = data.id;
  const email = extractEmail(data);
  const name = getUserName(data);

  if (!id || !email) {
    console.warn('Мэдээлэл дутуу байна:', { id, email });
    return res.status(400).json({ message: 'Хэрэглэгчийн мэдээлэл буруу байна' });
  }

  try {
    const user = await User.findOneAndUpdate({ clerkId: id }, { clerkId: id, email, name }, { upsert: true, new: true });

    return res.status(200).json({ message: 'Хэрэглэгч амжилттай бүртгэгдлээ', user });
  } catch (error) {
    console.error('Алдаа гарлаа', error);
    return res.status(500).json({ message: 'Алдаа гарлаа' });
  }
}

async function handleUserDelete(data: ClerkUserData, res: NextApiResponse) {
  const id = data.id;

  if (!id) {
    console.warn('Id олдсонгүй');
    return res.status(400).json({ message: 'Id олдсонгүй' });
  }

  try {
    await User.findOneAndDelete({ clerkId: id });
    return res.status(200).json({ message: 'Хэрэглэгч амжилттай устгагдлаа' });
  } catch (error) {
    console.error('Алдаа гарлаа', error);
    return res.status(500).json({ message: 'Алдаа гарлаа' });
  }
}

function extractEmail(data: ClerkUserData): string | undefined {
  const emails = data.email_addresses;
  return emails && emails.length > 0 ? emails[0].email_address : undefined;
}

function getUserName(data: ClerkUserData): string {
  if (data.username?.trim()) return data.username;
  return getFullName(data);
}

function getFullName(data: ClerkUserData): string {
  const first = typeof data.first_name === 'string' ? data.first_name : '';
  const last = typeof data.last_name === 'string' ? data.last_name : '';
  return `${first} ${last}`.trim();
}
