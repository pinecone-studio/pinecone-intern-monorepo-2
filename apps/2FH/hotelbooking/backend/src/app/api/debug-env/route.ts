import { NextRequest, NextResponse } from 'next/server';

const formatEnvVar = (value: string | undefined): string => {
  return value ? 'Set' : 'Not set';
};

const formatMongoUriInfo = (mongoUri: string | undefined) => {
  if (!mongoUri) {
    return {
      MONGO_URI: 'Not set',
      MONGO_URI_PREFIX: 'N/A'
    };
  }
  
  return {
    MONGO_URI: `Set (length: ${mongoUri.length})`,
    MONGO_URI_PREFIX: mongoUri.substring(0, 20) + '...'
  };
};

const getEnvironmentInfo = () => {
  const mongoInfo = formatMongoUriInfo(process.env.MONGO_URI);
  
  return {
    NODE_ENV: process.env.NODE_ENV,
    ...mongoInfo,
    VERCEL_TOKEN: formatEnvVar(process.env.VERCEL_TOKEN),
    EMAIL_ADDRESS: formatEnvVar(process.env.EMAIL_ADDRESS),
    JWT_SECRET: formatEnvVar(process.env.JWT_SECRET),
  };
};

const getCacheHeaders = () => ({
  'Cache-Control': 'no-cache, no-store, must-revalidate'
});

export async function GET(_request: NextRequest) {
  try {
    const envInfo = {
      timestamp: new Date().toISOString(),
      environment: getEnvironmentInfo(),
      fileSystem: {
        cwd: process.cwd(),
        envFileExists: 'Check manually',
      }
    };

    return NextResponse.json(envInfo, { 
      status: 200,
      headers: getCacheHeaders()
    });
    
  } catch (error) {
    console.error('Debug endpoint failed:', error);
    
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { 
      status: 500,
      headers: getCacheHeaders()
    });
  }
}
