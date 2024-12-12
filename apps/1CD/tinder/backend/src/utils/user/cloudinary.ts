import dotenv from 'dotenv';

const cloudinary = require('cloudinary').v2;

dotenv.config();

cloudinary.config({
  cloud_name: process.env.ClOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SERET,
});

export const handleUpload = async (file: string) => {
  const res = await cloudinary.uploader.upload(file, {
    resource_type: 'auto',
  });
  return res;
};
