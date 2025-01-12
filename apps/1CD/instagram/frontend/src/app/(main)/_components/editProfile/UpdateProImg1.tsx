'use client';
import Image from 'next/image';
import React, { useState } from 'react';

type ChangeProImage = { _id: string; profileImg: string };
type ChangeProfileImg = ({ _id }: ChangeProImage) => void;

const UpdateProImg1 = ({
  proImgData,
  setProImgData,
  changeProfileImg,
  _id,
  prevProImg,
}: {
  proImgData: string;
  setProImgData: React.Dispatch<React.SetStateAction<string>>;
  changeProfileImg: ChangeProfileImg;
  _id: string | undefined;
  prevProImg: string;
}) => {
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
    // if (!res.ok) throw new Error('upload image failed');

    const uploadedImage = await res.json();
    await changeProfileImg({ _id: _id!, profileImg: uploadedImage.secure_url });
    setImage(uploadedImage.secure_url);

    setProImgData(image);
  };
  return (
    <div className="cursor-pointer ">
      <label htmlFor="file-upload" className="flex gap-2 cursor-pointer ">
        Upload New Photo <Image width={1} height={1} data-testid="proImage" src={prevProImg} alt="profilezurag" className="absolute hidden object-cover w-1 h-1 rounded-full" />
      </label>
      <input data-testid="inputImage" id="file-upload" type="file" accept="image/*,video/*" className="hidden" onChange={handleUploadImg} />
    </div>
  );
};
export default UpdateProImg1;
