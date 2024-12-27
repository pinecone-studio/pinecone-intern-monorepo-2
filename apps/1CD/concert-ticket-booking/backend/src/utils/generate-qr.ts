import QRCode from 'qrcode';

type QrCodes = {
  ids: string;
};

export const qrCodes = async (ids: QrCodes[]): Promise<string[]> => {
  const qrCodePromises = ids.map(async (item) => {
    const url = `${process.env.PASSWORD_RESET_API}/user/ticket/${item}`;
    const qrCodeDataUrl = await QRCode.toDataURL(url);
    return qrCodeDataUrl;
  });
  return await Promise.all(qrCodePromises);
};
