/* eslint-disable no-secrets/no-secrets */
'use client';

import { Stack, Typography } from '@mui/material';
import { References } from '../../../components';

const references = [
  {
    label: 'Apollo server',
    path: 'https://www.apollographql.com/docs/apollo-server/',
    description: 'Apollo Server is an open-source, spec-compliant GraphQL server that&lsquo;s compatible with any GraphQL client, including Apollo Client.',
  },
  {
    label: 'Serverless Functions',
    path: `https://www.splunk.com/en_us/blog/learn/serverless-functions.html#:~:text=A%20serverless%20function%20is%20essentially,triggered%20by%20a%20specific%20condition.`,
    description: 'A serverless function is essentially a single-purpose piece of code that is designed to do one thing. It is triggered by a specific condition.',
  },
];

const Page = () => {
  return (
    <Stack>
      <Typography variant="h4" fontWeight="bold">
        Apollo server
      </Typography>

      <Typography py={2} color="text.secondary">
        Apollo Server is an open-source, spec-compliant GraphQL server that&lsquo;s compatible with any GraphQL client, including Apollo Client. It&lsquo;s the best way to build a production-ready,
        self-documenting GraphQL API that can use data from any source.
      </Typography>

      <Stack my={2}>
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/IUCV3ZDKyTs?si=PUAo55koC_lQiQ0I"
          title="YouTube video player"
          frameBorder="0"
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
