export async function uploadImageToCloudinary(file: File): Promise<string | undefined> {
  if (!(file instanceof File)) {
    throw new Error('Invalid file input');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'your_upload_preset_here');

  const response = await fetch('https://api.cloudinary.com/v1_1/ddcj2mdsk/upload', {
    method: 'POST',
    body: formData,
  });

  const { secure_url: secureUrl } = await response.json();
  return secureUrl;
}
