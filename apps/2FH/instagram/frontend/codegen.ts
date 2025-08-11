import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.BACKEND_ENDPOINT,
  documents: ['apps/2FH/instagram/frontend/src/**/*.graphql'],
  generates: {
    'apps/2FH/instagram/frontend/src/generated/index.ts': {
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
