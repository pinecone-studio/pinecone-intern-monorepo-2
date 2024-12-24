type Time = {
  hour: string;
  minute: string;
};

type DateRange = {
  from: Date;
  to?: Date;
};

export const combineDateAndTime = (dateRange: DateRange, time: Time): string[] => {
  const { from, to } = dateRange;
  const { hour, minute } = time;

  const setTime = (date: Date, hour: string, minute: string): string => {
    console.log({ date });
    const newDate = new Date(date);
<<<<<<< HEAD
    console.log('newDateehnii', newDate);
    newDate.setUTCHours(parseInt(hour, 10), parseInt(minute, 10), 0, 0);
=======
    console.log({ newDate });
    newDate.setHours(parseInt(hour, 10), parseInt(minute, 10), 0, 0);
    console.log({ newDate });
>>>>>>> 8a48c7e (feat(concert-frontend): filter frontend)
    return newDate.toISOString();
  };

  const result: string[] = [];
  const currentDate = new Date(from);
<<<<<<< HEAD

  currentDate.setUTCHours(currentDate.getUTCHours() + 8);
=======
  currentDate.setHours(0, 0, 0, 0);

>>>>>>> 8a48c7e (feat(concert-frontend): filter frontend)
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
