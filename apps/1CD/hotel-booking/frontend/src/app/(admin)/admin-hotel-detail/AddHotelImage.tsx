'use client';

import { Dialog, DialogContent } from '@/components/providers/HotelBookingDialog';
import { Button } from '@/components/ui/button';

import { Hotel, useUpdateHotelImagesMutation } from '@/generated';

import { Loader2, Plus } from 'lucide-react';
import Image from 'next/image';

import { ChangeEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';
const CLOUDINARYPRESET = `${process.env.CLOUDINARYPRESET}`;
const CLOUDINARYNAME = `${process.env.CLOUDINARYNAME}`;
const ImageUpdate = ({ open, setOpen, hotelId, hotel }: { open: boolean; setOpen: (_value: boolean) => void; hotelId: string; hotel: Hotel }) => {
  const [image, setImage] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [createImage] = useUpdateHotelImagesMutation();

  const [images, setImages] = useState<JSX.Element[]>([]);
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
    setLoading(true);
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
        id: hotelId,
        images: imageUrls,
      },
    });
    toast('successfully updated your image', {
      style: {
        color: 'green',
        border: 'green solid 1px',
      },
    });
    setLoading(false);
    setOpen(false);
  };
  useEffect(() => {
    const imagesArray: JSX.Element[] = [];
    if (hotel.images?.length) {
      hotel.images.forEach((image) => {
        imagesArray.push(<Image className="object-cover max-w-[552px] w-full max-h-[310px] h-full" src={String(image)} width={500} height={500} alt="image" />);
      });
      setImages(imagesArray);
    }
  }, [hotel.images]);
  return (
    <div className="max-w-[1920px]">
      <Dialog open={open}>
        <DialogContent data-cy="Dialog-Element" className="max-w-[1160px] w-full  max-h-[800px] h-full overflow-scroll">
          <div>
            <p className="text-[16px] py-2">Images</p>
            <div className="grid grid-cols-2 gap-2 rounded-sm">
              <div>
                <div
                  className="relative flex justify-center
                bg-[#e4e4e7] w-[552px] h-[310px] rounded-sm"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
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
              <Button data-cy="Cancel-Button" onClick={() => setOpen(false)}>
                cancel
              </Button>
              <Button data-cy="Save-Button" onClick={addImage} className="bg-[#2563EB]">
                {loading ? <Loader2 className="animate-spin" width={16} height={16} /> : 'save'}
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
