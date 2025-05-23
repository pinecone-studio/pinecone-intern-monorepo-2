import type { CodegenConfig } from '@graphql-codegen/cli';
 
const config: CodegenConfig = {
  overwrite: true,
  schema: 'apps/2CD/tinder/backend/src/schemas',
  generates: {
    'apps/2CD/tinder/backend/src/generated/index.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        contextType: '../types#Context',
        makeResolverTypeCallable: true,
        maybeValue: 'T',
      },
    },
  },
};
 
export default config;
 
 