/* eslint-disable no-secrets/no-secrets */
import mongoose from 'mongoose';

type ConnectToDatabaseOptions = {
  username?: string;
  password?: string;
};

export const connectToDatabase = async ({ username = 'developer', password = 'IqORt9VO7B4zTKF5' }: ConnectToDatabaseOptions) => {
  try {
    await mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.zd5kvja.mongodb.net/secrets?retryWrites=true&w=majority&appName=Cluster0`);
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
