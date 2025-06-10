'use client';
import React from 'react';
import { Button } from '@mui/material';

const SubmitButton = () => {
  return (
    <div className="pb-16 pt-6">
      <Button
        type="submit"
        variant="contained"
        sx={{
          backgroundColor: '#e11d48',
          textTransform: 'none',
          fontWeight: 'bold',
          px: 4,
          py: 1.5,
          '&:hover': {
            backgroundColor: '#be123c',
          }
        }}
      >
        Update profile
      </Button>
    </div>
  );
};

export default SubmitButton;
