/* eslint-disable no-secrets/no-secrets */
'use client';

import { Stack, Typography } from '@mui/material';
import { References } from '../../../components';

const references = [
  {
    label: 'Apollo Client React',
    path: 'https://www.apollographql.com/docs/react/',
    description: 'Apollo Client is a comprehensive state management library for JavaScript that enables you to manage both local and remote data with GraphQL.',
  },
];

const Page = () => {
  return (
    <Stack>
      <Typography variant="h4" fontWeight="bold">
        Apollo Client React
      </Typography>
      <Typography py={2} color="text.secondary">
        Apollo Client is a comprehensive state management library for JavaScript that enables you to manage both local and remote data with GraphQL. Use it to fetch, cache, and modify application
        data, all while automatically updating your UI.
      </Typography>
      <Stack my={2}>
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/GcER4OvG9j0?si=Q4pyKgqADMhYLn9J"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </Stack>

      <References items={references} />
    </Stack>
  );
};

export default Page;
