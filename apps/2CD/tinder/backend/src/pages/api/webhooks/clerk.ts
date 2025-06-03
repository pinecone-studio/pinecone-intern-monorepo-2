import { WebhookEvent } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import User from '../../../models/user';

// Webhook
interface UserData {
  id: string;
  emailAddresses: Array<{ emailAddress: string }>;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
}

const isValidEmailAddresses = (data: unknown): boolean => {
  if (!Array.isArray(data)) return false;
  return data.length > 0 && typeof data[0]?.emailAddress === 'string';
};

const isUserData = (data: unknown): data is UserData => {
  if (typeof data !== 'object' || data === null) return false;
  const userData = data as Record<string, unknown>;

  return typeof userData.id === 'string' && isValidEmailAddresses(userData.emailAddresses);
};

const handleUserEvent = async (evt: WebhookEvent) => {
  if (!isUserData(evt.data)) {
    return new NextResponse('Хэрэглэгчийн мэдээлэл буруу байна', { status: 400 });
  }

  const { id, emailAddresses, username, firstName, lastName } = evt.data;

  const user = await User.findOneAndUpdate(
    { clerkId: id },
    {
      clerkId: id,
      email: emailAddresses[0]?.emailAddress,
      name: username || `${firstName} ${lastName}`.trim(),
    },
    { upsert: true, new: true }
  );

  return NextResponse.json({ message: 'Хэрэглэгч амжилттай бүртгэгдлээ', user });
};

const handleUserDelete = async (evt: WebhookEvent) => {
  const { id } = evt.data as { id: string };
  await User.findOneAndDelete({ clerkId: id });
  return NextResponse.json({ message: 'Хэрэглэгч амжилттай устгагдлаа' });
};

const handleWebhook = async (evt: WebhookEvent) => {
  const eventType = evt.type;

  if (eventType === 'user.created' || eventType === 'user.updated') {
    return handleUserEvent(evt);
  }

  if (eventType === 'user.deleted') {
    return handleUserDelete(evt);
  }

  return NextResponse.json({ message: 'webhook' });
};

export default async function handler(req: Request) {
  try {
    const payload = await req.json();
    const evt = payload as WebhookEvent;
    return handleWebhook(evt);
  } catch (error) {
    console.error('Алдаа гарлаа:', error);
    return new NextResponse('Алдаа гарлаа', { status: 500 });
  }
}
