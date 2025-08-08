/* eslint-disable no-secrets/no-secrets */
import mongoose from 'mongoose';

type ConnectToDatabaseOptions = {
  username?: string;
  password?: string;
};

// Тусдаа функц: URI-ийг үүсгэх логик
const buildMongoUri = ({ username, password }: ConnectToDatabaseOptions): string => {
  if (process.env.MONGO_URI) return process.env.MONGO_URI;

  const user = username || 'munhuu21';
  const pass = password || 'zppRKHucw54llDra';
  return `mongodb+srv://${user}:${pass}@cluster0.zd5kvja.mongodb.net/secrets?retryWrites=true&w=majority&appName=Cluster0`;
};

export const connectToDatabase = async (options: ConnectToDatabaseOptions) => {
  try {
    const mongoUri = buildMongoUri(options);
    await mongoose.connect(mongoUri);
  } catch (error) {
    throw new Error('Error connecting to database');
  }
};

export const disconnectFromDatabase = async () => {
  try {
    await mongoose.disconnect();
  } catch (error) {
    throw new Error('Error disconnecting from database');
  }
};
