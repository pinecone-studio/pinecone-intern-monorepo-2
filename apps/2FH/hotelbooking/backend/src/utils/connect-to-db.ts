import { connect, ConnectOptions } from 'mongoose';

export const connectToDb = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not set');
    }

    console.log('🔌 Attempting to connect to MongoDB...');
    
    // Use minimal working configuration that we know works
    const connectionOptions: ConnectOptions = {
      // Basic timeout settings
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      
      // Basic connection settings
      maxPoolSize: 5,
      minPoolSize: 1,
      
      // Basic retry settings
      retryWrites: true,
      retryReads: true,
    };

    await connect(process.env.MONGO_URI, connectionOptions);
    console.log('✅ Connected to MongoDB successfully');
    
    // Set up connection event listeners
    const mongoose = await import('mongoose');
    const connection = mongoose.connection;
    
    connection.on('error', (error) => {
      console.error('❌ MongoDB connection error:', error);
    });
    
    connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
    });
    
    connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });
    
    connection.on('close', () => {
      console.warn('🔒 MongoDB connection closed');
    });
    
    // Additional event listeners for better monitoring
    connection.on('connected', () => {
      console.log('🔗 MongoDB connection established');
    });
    
    connection.on('connecting', () => {
      console.log('⏳ MongoDB connecting...');
    });
    
    connection.on('disconnecting', () => {
      console.log('🔌 MongoDB disconnecting...');
    });
    
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    throw error;
  }
};
