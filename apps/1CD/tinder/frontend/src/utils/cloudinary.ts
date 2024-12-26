/* eslint-disable camelcase */
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_UPLOAD_PRESET as string;

if (!CLOUD_NAME || !UPLOAD_PRESET) {
  console.error('Missing Cloudinary environment variables.');
}

type CloudinaryResponse = {
  secure_url?: string;
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
  return info && info.secure_url ? info.secure_url : '';
};

export const uploadFilesInCloudinary = async (file: File): Promise<string> => {
  try {
    const data = createFormData(file);

    const res = await uploadFileRequest(data);

    console.log('Cloudinary response:', res);
    const info: CloudinaryResponse = await res.json();

    if (!res.ok) {
      console.error('Failed to upload:', res.statusText, info.error.message);
      throw new Error(`Failed to upload: ${res.statusText} - ${info.error.message}`);
    }

    console.log('Cloudinary JSON response:', info);

    return extractSecureUrl(info);
  } catch (error) {
    console.error('Upload failed:', error);
    return '';
  }
};
