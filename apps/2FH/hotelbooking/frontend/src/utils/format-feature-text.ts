export const formatFeatureText = (text: string): string => {
  return text
    .replace(/_/g, ' ') // Replace underscores with spaces
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
    .join(' ');
};
