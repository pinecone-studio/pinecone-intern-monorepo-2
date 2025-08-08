import { connect } from 'mongoose';

export const connectToDb = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGO_URI environment variable is not defined');
  }
  await connect(mongoUri);
};
