// 'use client';

// import React from 'react';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import dayjs from 'dayjs';
// import { Typography } from '@mui/material';

// type FormDatePickerProps = {
//   label: string;
//   value: Date | null;
//   onChange: (date: Date | null) => void;
//   error?: boolean;
//   helperText?: string;
// };

// const FormDatePicker = ({
//   label,
//   value,
//   onChange,
//   error,
//   helperText,
// }: FormDatePickerProps) => {

//   const handleDateChange = (date: dayjs.Dayjs | null) => {
//     onChange(date ? date.toDate() : null);
//   };

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
//       <Typography variant="subtitle1" sx={{ color: 'white' }}>
//         {label}
//       </Typography>

//       <LocalizationProvider dateAdapter={AdapterDayjs}>
//         <DatePicker
//           value={value ? dayjs(value) : null}
//           onChange={handleDateChange}
//           slotProps={{
//             textField: {
//               fullWidth: true,
//               error,
//               helperText,
//               sx: {
//                 '& .MuiInputBase-root': {
//                   color: 'white',
//                   borderColor: '#444',
//                 },
//                 '& .MuiOutlinedInput-notchedOutline': {
//                   borderColor: '#444',
//                 },
//                 '& .MuiInputLabel-root': {
//                   color: '#ccc',
//                 },
//                 '& .MuiSvgIcon-root': {
//                   color: '#ccc',
//                 },
//                 '&:hover .MuiOutlinedInput-notchedOutline': {
//                   borderColor: '#777',
//                 },
//               },
//             },
//           }}
//         />
//       </LocalizationProvider>
//       <p className='text-[#ccc]'>Your date of birth is used to calculate your age.</p>
//     </div>
//   );
// };

// export default FormDatePicker;