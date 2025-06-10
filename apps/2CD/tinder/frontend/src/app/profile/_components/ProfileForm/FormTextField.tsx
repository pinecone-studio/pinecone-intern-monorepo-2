'use client';
import { TextField, TextFieldProps, Typography } from '@mui/material';
import { useField } from 'formik';
import React from 'react';

type FormTextFieldProps = TextFieldProps & {
  field: ReturnType<typeof useField>[0];
  meta: ReturnType<typeof useField>[1];
  labelText?: string;
};

const FormTextField = ({ field, meta, labelText, ...props }: FormTextFieldProps) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
    {labelText && (
      <Typography variant="subtitle1" sx={{ color: 'white' }}>
        {labelText}
      </Typography>
    )}
    <TextField
      {...field}
      {...props}
      error={meta.touched && Boolean(meta.error)}
      helperText={meta.touched && meta.error}
      InputLabelProps={{ style: { color: '#ccc' } }}
      InputProps={{ style: { color: 'white' } }}
      sx={{
        '& .MuiOutlinedInput-root': {
          '& fieldset': { borderColor: '#444' },
          '&:hover fieldset': { borderColor: '#777' },
          '&.Mui-focused fieldset': { borderColor: '#aaa' },
          '& .MuiSvgIcon-root': { color: '#ccc' },
        },
      }}
    />
  </div>
);

export default FormTextField;
