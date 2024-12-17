import dotenv from 'dotenv';

dotenv.config();
const CLOUD_NAME = process.env.CLOUD_NAME;
const UPLOAD_PRESET = process.env.UPLOAD_PRESET as string;

type CloudinaryResponse = {
  secureUrl?: string;
  [key: string]: any;
};

const createFormData = (file: File): FormData => {
  const data = new FormData();
  data.append('file', file);
  data.append('upload_preset', UPLOAD_PRESET);
  return data;
};

const uploadFileRequest = async (data: FormData): Promise<Response> => {
  return fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, {
    method: 'POST',
    body: data,
  });
};

const extractSecureUrl = (info: CloudinaryResponse): string => {
  return info && info.secureUrl ? info.secureUrl : '';
};

export const uploadFilesInCloudinary = async (file: File): Promise<string> => {
  try {
    console.log(`Uploading: `, file);

    const data = createFormData(file);

    const res = await uploadFileRequest(data);

    console.log('Cloudinary response:', res);
    const info: CloudinaryResponse = await res.json();

    if (!res.ok) {
      console.error('Failed to upload:', res.statusText, info);
      throw new Error(`Failed to upload: ${res.statusText}`);
    }

    console.log('Cloudinary JSON response:', info);

    return extractSecureUrl(info);
  } catch (error) {
    console.error('Upload failed:', error);
    return '';
  }
};
