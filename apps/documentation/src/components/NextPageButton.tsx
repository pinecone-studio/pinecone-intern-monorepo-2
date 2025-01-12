import { ArrowForward } from '@mui/icons-material';
import { Button, Divider, Stack, Typography } from '@mui/material';
import Link from 'next/link';

type NextPageButtonProps = {
  label: string;
  path: string;
};

export const NextPageButton = ({ label, path }: NextPageButtonProps) => {
  return (
    <>
      <Divider sx={{ my: 4 }} />

      <Stack direction="row" justifyContent="flex-end">
        <Link href={path}>
          <Button
            sx={{
              '&:hover .MuiButton-endIcon': {
                transform: 'translateX(4px)',
              },
              '& .MuiButton-endIcon': {
                transition: 'transform 0.3s',
              },
            }}
            endIcon={<ArrowForward />}
          >
            <Typography textTransform="none">{label}</Typography>
          </Button>
        </Link>
      </Stack>
    </>
  );
};
