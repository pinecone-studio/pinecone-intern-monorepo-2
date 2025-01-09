'use client';
type Props = {
  dayOfWeek: string;
  previousDayOfWeek: string | null;
  formattedDate: string;
  mongolianDate: string;
};

export const Chatdate = ({ dayOfWeek, previousDayOfWeek, formattedDate, mongolianDate }: Props) => {
  return <p className={`self-center text-gray-500 text-base ${dayOfWeek === previousDayOfWeek ? 'hidden' : 'block'}`}>{formattedDate == mongolianDate ? 'Today' : `${dayOfWeek} ${formattedDate}`}</p>;
};
