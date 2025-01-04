export const isLessThan24Hours = (isoString: string) => {
  const date1 = new Date();
  const date2 = new Date(isoString);
  const diffInMs = Math.abs(date1.getTime() - date2.getTime());
  const hours24InMs = 24 * 60 * 60 * 1000;
  return diffInMs <= hours24InMs;
};
