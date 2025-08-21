import { GraphQLError } from "graphql";

const secretStrategies = {
  test: () => process.env.JWT_SECRET || 'test-jwt-secret-for-testing-only',
  development: () => process.env.JWT_SECRET || 'build-time-fallback-secret',
  production: () => {
    if (!process.env.JWT_SECRET) {
      throw new GraphQLError("JWT_SECRET not found", {
        extensions: { code: "SECRET_NOT_FOUND" }
      });
    }
    return process.env.JWT_SECRET;
  }
};

const getEnvironmentType = (): keyof typeof secretStrategies => {
  if (process.env.NODE_ENV === 'test') return 'test';
  if (process.env.NODE_ENV !== 'production' || process.env.NEXT_PHASE === 'phase-production-build') {
    return 'development';
  }
  return 'production';
};

export const getJwtSecret = (): string => {
  const envType = getEnvironmentType();
  return secretStrategies[envType]();
};

const isTestEnvironment = (): boolean => process.env.NODE_ENV === 'test';

const isDevelopmentOrBuild = (): boolean => 
  process.env.NODE_ENV !== 'production' || process.env.NEXT_PHASE === 'phase-production-build';

const getTestSecret = (): string => 
  process.env.JWT_SECRET || 'test-jwt-secret-for-testing-only';

const getDevelopmentSecret = (): string => 
  process.env.JWT_SECRET || 'build-time-fallback-secret';

const getProductionSecret = (): string => {
  if (!process.env.JWT_SECRET) {
    throw new GraphQLError("JWT_SECRET not found", {
      extensions: {
        code: "SECRET_NOT_FOUND"
      }
    });
  }
  return process.env.JWT_SECRET;
};

export const getJwtSecretReadable = (): string => {
  if (isTestEnvironment()) {
    return getTestSecret();
  }
  
  if (isDevelopmentOrBuild()) {
    return getDevelopmentSecret();
  }
  
  return getProductionSecret();
};