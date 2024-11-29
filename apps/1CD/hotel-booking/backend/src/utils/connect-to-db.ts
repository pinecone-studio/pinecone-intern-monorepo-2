import { connect } from 'mongoose';

export const connectToDb = async () => {
  try {
    await connect(process.env.MONGO_URI || '');
    console.log('ajillaj bn');
  } catch (err) {
    throw new Error((err as Error).message);
  }
};
