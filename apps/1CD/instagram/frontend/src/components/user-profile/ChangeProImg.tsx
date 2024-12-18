'use client';
import Image from 'next/image';
import React, { useState } from 'react';

// interface proImgProps {
//   proImgData: string;
//   setProImgData: React.Dispatch<React.SetStateAction<string>>;
// }
const ProImg = ({ proImgData, setProImgData }: { proImgData: string; setProImgData: React.Dispatch<React.SetStateAction<string>> }) => {
  const [image, setImage] = useState<string>(proImgData);
  const handleUploadImg = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event?.target?.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'instagram-intern');
    data.append('cloud_name', 'dka8klbhn');

    const res = await fetch('https://api.cloudinary.com/v1_1/dka8klbhn/image/upload', {
      method: 'POST',
      body: data,
    });
    const uploadedImage = await res.json();
    setImage(uploadedImage.secure_url);
    setProImgData(image);
  };
  console.log('imageiin urliig harah', image);
  return (
    <div>
      <label htmlFor="file-upload">
        <div className="relative w-36 h-36 rounded-full">
          <Image src={proImgData} alt="profilezurag" fill className="absolute rounded-full" />
        </div>
      </label>
      <input id="file-upload" type="file" accept="image/*,video/*" className="hidden" onChange={handleUploadImg} />
    </div>
  );
};
export default ProImg;
