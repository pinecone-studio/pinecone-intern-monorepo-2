
export const formatNumber = (num: number): string => {
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
    return num.toString();
  };