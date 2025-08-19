import { connect } from 'mongoose';
 
export const connectToDb = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not set');
    }
 
    console.log('🔌 Attempting to connect to MongoDB...');
    await connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB successfully');
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    throw error;
  }
};
 
