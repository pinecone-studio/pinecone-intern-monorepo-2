export const generateMinutes = (): string[] => {
  const minutes = [];
  for (let i = 0; i < 60; i += 10) {
    const minute = i < 10 ? `0${i}` : `${i}`;
    minutes.push(minute);
  }
  return minutes;
};

export const generateHours = (): string[] => {
  const hours = [];
  for (let i = 0; i <= 24; i++) {
    const hour = i < 10 ? `0${i}` : `${i}`;
    hours.push(hour);
  }
  return hours;
};

export const generateDatesWithTime = (startDate: Date, endDate: Date, time: string): Date[] => {
  const dates: Date[] = [];
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const [hour, minute] = time.split(':').map((t) => parseInt(t, 10));
    const dateWithTime = new Date(currentDate);
    dateWithTime.setHours(hour, minute, 0, 0);
    dates.push(new Date(dateWithTime));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
};
