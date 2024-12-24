import crypto from 'crypto';

export const generateSHA1 = (data: any) => {
  const hash = crypto.createHash('sha1');
  hash.update(data);
  return hash.digest('hex');
};

export const generateSignature = (publicId: string, apiSecret: string) => {
  const timestamp = new Date().getTime();
  return `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
};
