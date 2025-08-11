import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'apps/2FH/tinder/backend/src/schemas/**/*.ts',
  documents: ['apps/2FH/tinder/frontend/src/**/*.graphql'],
 
  generates: {
    'apps/2FH/Tinder/Frontend/src/generated/index.ts': {
      config: {
        reactApolloVersion: 3,
        withHOC: true,
        withHooks: true,
      },
      plugins: [
        {
          add: {
            content: '// @ts-nocheck',
          },
        },
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
      ],
    },
  },
};
export default config;
