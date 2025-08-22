import { NextRequest, NextResponse } from 'next/server';
import { connectToDb } from '../../../utils/connect-to-db';

const getReadyStateText = (readyState: number): string => {
  const stateMap: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  
  return stateMap[readyState] || 'unknown';
};

const getDatabaseStatus = (connection: any) => ({
  status: connection.readyState === 1 ? 'connected' : 'disconnected',
  readyState: connection.readyState,
  readyStateText: getReadyStateText(connection.readyState),
  host: connection.host,
  port: connection.port,
  name: connection.name,
});

const getEnvironmentInfo = () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUriSet: !!process.env.MONGO_URI,
});

const getCacheHeaders = () => ({
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0'
});

const tryDatabaseConnection = async (healthStatus: any) => {
  try {
    await connectToDb();
    healthStatus.database.status = 'connected';
    healthStatus.database.readyState = 1;
    healthStatus.database.readyStateText = 'connected';
  } catch (error) {
    healthStatus.status = 'unhealthy';
    healthStatus.database.status = 'connection_failed';
    healthStatus.database.readyStateText = 'connection_failed';
  }
};

const createErrorResponse = (error: unknown) => ({
  status: 'error',
  timestamp: new Date().toISOString(),
  error: error instanceof Error ? error.message : 'Unknown error',
  database: {
    status: 'unknown',
    readyState: -1,
    readyStateText: 'unknown'
  }
});

export async function GET(_request: NextRequest) {
  try {
    const mongoose = await import('mongoose');
    const connection = mongoose.connection;
    
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: getDatabaseStatus(connection),
      environment: getEnvironmentInfo()
    };

    if (connection.readyState !== 1) {
      await tryDatabaseConnection(healthStatus);
    }

    const statusCode = healthStatus.status === 'healthy' ? 200 : 503;
    
    return NextResponse.json(healthStatus, { 
      status: statusCode,
      headers: getCacheHeaders()
    });
    
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json(createErrorResponse(error), { 
      status: 500,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  }
}
