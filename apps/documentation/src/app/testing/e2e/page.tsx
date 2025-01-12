/* eslint-disable no-secrets/no-secrets */
'use client';

import { Stack, Typography } from '@mui/material';

const Page = () => {
  return (
    <Stack>
      <Typography variant="h4" fontWeight="bold" mb={2}>
        E2E testing
      </Typography>
      {/* What is E2E*/}

      <Typography variant="h6" fontWeight="bold">
        What is E2E
      </Typography>
      <Stack my={3}>
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/aXAjH4wsoWI?si=rxjhWp6BUtlPYTgQ"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </Stack>

      {/* E2E Testing Demo */}
      <Typography variant="h6" fontWeight="bold">
        E2E Testing Demo
      </Typography>

      <Stack my={3}>
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/X8gXJIPD_wY?si=RLsA0fEZH-5dwu_R"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </Stack>

      <Typography variant="h6" fontWeight="bold">
        E2E Commands and Coverage
      </Typography>

      {/* E2E Commands and Coverage */}
      <Stack my={3}>
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/MePuN_XzVCc?si=4ycDu2RgDzTmWnwW"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </Stack>
    </Stack>
  );
};

export default Page;
