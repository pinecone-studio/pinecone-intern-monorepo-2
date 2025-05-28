/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { connect } from 'mongoose';

export const connectToDb = async () => {
  await connect(process.env.MONGO_URI!);
};
