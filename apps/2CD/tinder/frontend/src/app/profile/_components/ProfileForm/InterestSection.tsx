'use client';

import { Chip, Stack, Typography } from '@mui/material';

type InterestSectionProps = {
  formik: any;
};

// Mock data for interest options
const interestOptions = [
  'Art', 'Music', 'Investment', 'Technology', 'Design',
  'Education', 'Health', 'Fashion', 'Travel', 'Food'
];

const InterestSection = ({ formik }: InterestSectionProps) => {
  const selected = formik.values.selectedInterests as string[];

  const handleToggle = (value: string) => {
    const isSelected = selected.includes(value);
    const newSelected = isSelected
      ? selected.filter((item) => item !== value)
      : [...selected, value];
    formik.setFieldValue('selectedInterests', newSelected);
  };

  return (
    <div className='flex flex-col gap-2'>
      <Typography variant="subtitle1" sx={{ color: 'white'}}>
        Interests
      </Typography>
      <Stack direction="row" flexWrap="wrap" gap={1}>
        {interestOptions.map((option) => (
          <Chip
            key={option}
            label={option}
            onClick={() => handleToggle(option)}
            color={selected.includes(option) ? 'primary' : 'default'}
            sx={{
              borderRadius: '999px',
              cursor: 'pointer',
              bgcolor: selected.includes(option) ? '#e11d48' : '#333',
              color: 'white',
              '&:hover': {
                bgcolor: selected.includes(option) ? '#be123c' : '#555'
              }
            }}
          />
        ))}
      </Stack>
      <p className='text-[#ccc]'>You can select up to a maximum of 10 interests.</p>
    </div>
  );
};

export default InterestSection;
