export const getValidImageUrl = (url: string | undefined, fallback: string): string => {
  return url && (url.startsWith('http') || url.startsWith('/')) ? url : fallback;
};
