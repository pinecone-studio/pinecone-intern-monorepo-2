'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useUpdateHotelImagesMutation } from '@/generated';

import { DialogTrigger } from '@radix-ui/react-dialog';

import { Plus } from 'lucide-react';
import Image from 'next/image';

import { ChangeEvent, useState } from 'react';
const CLOUDINARYPRESET = `${process.env.CLOUDINARYPRESET}`;
const CLOUDINARYNAME = `${process.env.CLOUDINARYNAME}`;
const ImageUpdate = () => {
  const [image, setImage] = useState<File[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [createImage] = useUpdateHotelImagesMutation();

  const [images, setImages] = useState<JSX.Element[]>([]); // Array to hold image previews
  const [value, setValue] = useState('');
  const showImage = async (e: ChangeEvent<HTMLInputElement>) => {
    setValue('value');
    const file = e.currentTarget.files?.[0] as File;
    const img = <Image alt="image" className="object-cover max-w-[552px] w-full max-h-[310px] h-full" src={URL.createObjectURL(file)} width={500} height={500} />;
    const array = [...images];
    array.unshift(img);
    setImages(array);
    setValue('');
    setImage((prevFiles) => [...prevFiles, file]);
  };

  const addImage = async () => {
    const promises = image.map((file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARYPRESET);
      return fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARYNAME}/upload`, {
        method: 'POST',
        body: formData,
      }).then((res) => res.json());
    });

    const imageUrls = (await Promise.all(promises)).map((data) => data.secure_url);

    await createImage({
      variables: {
        id: '67734d4aa494d000fe224b6d',
        images: imageUrls,
      },
    });
    setIsOpen(false);
  };
  return (
    <div className="max-w-[1920px]">
      <Dialog open={isOpen}>
        <DialogTrigger data-cy="Open-Dialog-Button" onClick={() => setIsOpen(true)}>
          click
        </DialogTrigger>
        <DialogContent data-cy="Dialog-Element" className="max-w-[1160px] w-full  max-h-[800px] h-full overflow-scroll">
          <div>
            <p className="text-[16px] py-2">Images</p>
            <div className="grid grid-cols-2 gap-2 rounded-sm">
              <div>
                <div
                  className="relative flex justify-center
                bg-[#e4e4e7] w-[552px] h-[310px] rounded-sm"
                >
                  <div className="flex gap-2 flex-col items-center justify-center">
                    <Plus />
                    <div className="">drag update photo</div>
                  </div>
                  <input data-cy="Image-Upload-Input" multiple value={value} onChange={showImage} className="absolute inset-0 opacity-0" type="file" />
                </div>
              </div>
              {images.map((image, index) => (
                <div key={index}>{image}</div>
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-end">
            <div className="flex justify-between">
              <Button data-cy="Cancel-Button" onClick={() => setIsOpen(false)}>
                cancel
              </Button>
              <Button data-cy="Save-Button" onClick={addImage} className="bg-[#2563EB]">
                save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <div />
    </div>
  );
};
export default ImageUpdate;
