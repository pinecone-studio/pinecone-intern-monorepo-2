import { connect } from 'mongoose';

export const connectToDb = async () => {
  try {
    await connect(process.env.MONGO_URI!);
    console.log('connection successful');
  } catch (error) {
    console.log('Mongoose connection error', error);
    console.log('connection Failed');
  }
};
