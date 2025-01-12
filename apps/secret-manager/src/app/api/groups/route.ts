import { connect } from 'mongoose';
import { SecretGroupModel } from './_models';

export async function GET() {
  await connect(process.env.MONGO_URI as string);

  const data = await SecretGroupModel.find().sort({ createdAt: -1 });

  return Response.json(data);
}

export const dynamic = 'force-dynamic';
