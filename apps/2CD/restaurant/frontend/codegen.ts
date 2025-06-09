import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.NEXT_PUBLIC_BACKEND_URI ?? process.env.LOCAL_BACKEND_URI,
  documents: ['apps/2CD/restaurant/frontend/src/**/*.graphql'],
  generates: {
    'apps/2CD/restaurant/frontend/src/generated/index.ts': {
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
