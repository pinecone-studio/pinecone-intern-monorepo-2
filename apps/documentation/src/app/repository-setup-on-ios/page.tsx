/* eslint-disable no-secrets/no-secrets */
'use client';

import { Stack, Typography } from '@mui/material';

const Page = () => {
  return (
    <Stack>
      <Typography variant="h4" fontWeight="bold">
        Repository setup on IOS
      </Typography>
      <Stack my={2}>
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/659-P6aszLY?si=NNHNjnCm0FR99h1f"
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
