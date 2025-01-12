import { connect } from 'mongoose';
import { SecretGroupModel } from '../_models';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  await connect(process.env.MONGO_URI as string);

  const name = req.nextUrl.pathname.split('/').at(-1);

  const data = await SecretGroupModel.findOne({
    groupName: name,
  });

  return Response.json(data);
}

export async function DELETE(req: NextRequest) {
  await connect(process.env.MONGO_URI as string);

  const name = req.nextUrl.pathname.split('/').at(-1);

  await SecretGroupModel.findOneAndDelete({
    groupName: name,
  });

  return Response.json({ success: true });
}

export async function PUT(req: NextRequest) {
  await connect(process.env.MONGO_URI as string);

  const name = req.nextUrl.pathname.split('/').at(-1);
  const body = await req.json();

  const current = await SecretGroupModel.findOne({
    groupName: name,
  });

  await SecretGroupModel.findOneAndUpdate(
    {
      groupName: name,
    },
    {
      secrets: {
        ...current.secrets,
        ...body,
      },
    }
  );

  return Response.json({ success: true });
}

export async function POST(req: NextRequest) {
  await connect(process.env.MONGO_URI as string);

  const name = req.nextUrl.pathname.split('/').at(-1);

  await SecretGroupModel.create({
    groupName: name,
    secrets: {
      test: {
        KEY: 'VALUE',
      },
      prod: {
        KEY: 'VALUE',
      },
      dev: {
        KEY: 'VALUE',
      },
    },
  });

  return Response.json({ success: true });
}
