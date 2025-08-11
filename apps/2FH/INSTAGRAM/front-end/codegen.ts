/* eslint-disable no-secrets/no-secrets */
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'https://back-end-testing-hqermru7z-instagram2025hf-6644618e.vercel.app/api/graphql',
  documents: ['apps/2FH/INSTAGRAM/front-end/src/**/*.graphql'], 
  generates: {
    'apps/2FH/INSTAGRAM/front-end/src/generated/index.ts': {
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
