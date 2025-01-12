/* eslint-disable no-secrets/no-secrets */
'use client';

import { Stack, Typography } from '@mui/material';

const Page = () => {
  return (
    <Stack>
      <Typography variant="h4" fontWeight="bold">
        Github Project
      </Typography>
      <Stack my={2}></Stack>
    </Stack>
  );
};

export default Page;
