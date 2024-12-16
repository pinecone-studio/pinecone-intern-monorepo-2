type Time = {
  hour: string;
  minute: string;
};

type DateRange = {
  from: Date;
  to?: Date;
};

export const combineDateAndTime = (dateRange: DateRange, time: Time): Date[] => {
  const { from, to } = dateRange;
  const { hour, minute } = time;
  const setTime = (date: Date, hour: string, minute: string): Date => {
    const newDate = new Date(date);
    newDate.setHours(parseInt(hour, 10), parseInt(minute, 10), 0, 0);
    return newDate;
  };
  const result: Date[] = [];
  const currentDate = new Date(from);
  currentDate.setHours(0, 0, 0, 0);
  result.push(setTime(currentDate, hour, minute));
  if (to) {
    const endDate = new Date(to);
    endDate.setHours(23, 59, 59, 999);
    while (currentDate < endDate) {
      currentDate.setDate(currentDate.getDate() + 1);
      if (currentDate <= endDate) {
        result.push(setTime(currentDate, hour, minute));
      }
    }
  }
  return result;
};
