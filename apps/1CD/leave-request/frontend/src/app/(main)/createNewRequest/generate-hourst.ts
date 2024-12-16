export const generateHours = () => {
    const startHour = 8; // Start from 8:00 AM
    const duration = 8; // Generate hours for 8 hours
    return Array.from({ length: duration }, (_, i) => {
      const hour = startHour + i;
      const formattedTime = `${hour}:00`;
      return { label: formattedTime, value: formattedTime };
    });
  };
  