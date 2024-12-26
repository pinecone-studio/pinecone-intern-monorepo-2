import { TZDate } from '@date-fns/tz';
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
    date.setHours(parseInt(hour, 10), parseInt(minute, 10), 0, 0);
    const timeInMongolia = new TZDate(date, 'Asia/Ulaanbaatar');
    const timeInMongoliaIso = new TZDate(timeInMongolia, 'UTC');
    const result = timeInMongoliaIso.toISOString();
    return result;
  };
  const result: string[] = [];
  const currentDate = new Date(from);
  currentDate.setHours(0, 0, 0, 0);
  currentDate.setUTCHours(currentDate.getUTCHours() + 8);
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
