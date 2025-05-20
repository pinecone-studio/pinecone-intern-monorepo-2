import 'dotenv/config'; // Automatically loads .env
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.LOCAL_BACKEND_URI_MINIIH ?? "http://localhost:4200/api/graphql",
  documents: ['apps/2CD/tinder/frontend/src/**/*.graphql'],
  generates: {
    'apps/2CD/tinder/frontend/src/generated/index.ts': {
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
