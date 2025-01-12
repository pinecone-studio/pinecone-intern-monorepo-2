/* eslint-disable no-secrets/no-secrets */
'use client';

import { Stack, Typography } from '@mui/material';
import { NextPageButton, References } from '../../../components';

const references = [
  {
    label: 'Jest Testing React',
    path: 'https://jestjs.io/docs/tutorial-react',
    description: 'Learn how to test React components with Jest',
  },
  {
    label: 'Apollo Client Testing',
    path: 'https://www.apollographql.com/docs/react/development-testing/testing/',
    description: 'Learn how to test Apollo Client with Jest',
  },
  {
    label: 'Jest Getting Started',
    path: 'https://jestjs.io/docs/getting-started',
    description: 'Learn how to get started with Jest',
  },
  {
    label: 'Unit Testing',
    path: `https://aws.amazon.com/what-is/unit-testing/#:~:text=A%20unit%20test%20is%20a,developer's%20theoretical%20logic%20behind%20it.`,
    description: 'Learn the basics of unit testing',
  },
];

const Page = () => {
  return (
    <Stack>
      <Typography variant="h4" fontWeight="bold">
        Jest testing
      </Typography>

      <Typography py={2} color="text.secondary" variant="body1">
        Unit tests verify the smallest parts of your application in complete isolation, ensuring they work as expected
      </Typography>

      <Typography variant="h6" fontWeight="bold">
        Backend
      </Typography>

      <Stack my={2}>
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/1W4zOReGK_U?si=v2tNs8gqapGAEiz1"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </Stack>

      <Typography variant="h6" fontWeight="bold">
        Frontend
      </Typography>

      <Stack my={2}>
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/9RhxqJrFerM?si=SX33y_B5BI8VuwZ3"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </Stack>

      <References items={references} />

      <NextPageButton label="E2E Testing" path="/testing/e2e" />
    </Stack>
  );
};

export default Page;
