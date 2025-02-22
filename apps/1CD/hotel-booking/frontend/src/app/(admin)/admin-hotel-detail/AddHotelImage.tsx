'use client';
import { Dialog, DialogContent } from '@/components/providers/HotelBookingDialog';
import { Button } from '@/components/ui/button';
import { Hotel, useUpdateHotelImagesMutation } from '@/generated';
import { Loader2, Plus, X } from 'lucide-react';
import Image from 'next/image';
import { ChangeEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';
const CLOUDINARYPRESET = `${process.env.CLOUDINARYPRESET}`;
const CLOUDINARYNAME = `${process.env.CLOUDINARYNAME}`;
const ImageUpdate = ({ open, setOpen, hotelId, hotel, AllQueriesRefetch }: { open: boolean; setOpen: (_value: boolean) => void; hotelId: string; hotel: Hotel; AllQueriesRefetch: () => void }) => {
  const [image, setImage] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [imagesUrl, setImagesUrl] = useState<string[]>([]);
  const [createImage] = useUpdateHotelImagesMutation({
    onCompleted: () => AllQueriesRefetch(),
  });
  const [images, setImages] = useState<{ id: string; jsx: JSX.Element }[]>([]);
  const showImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0] as File;
    const id = URL.createObjectURL(file);
    const img = (
      <div className="relative">
        <Image alt="image" className="object-cover max-w-[552px] bg-slate-400 w-full max-h-[310px] h-full" src={id} width={500} height={500} />
        <X data-cy="Remove-Image-Button1" onClick={() => removeImage(id)} className="absolute z-50 bg-white cursor-pointer top-1 right-1" width={32} height={32} />
      </div>
    );
    setImages((prev) => [{ id, jsx: img }, ...prev]);
    setImage((prevFiles) => [...prevFiles, file]);
  };
  const removeImage = (imageId: string) => {
    setImages((prev) => prev.filter((image) => image.id !== imageId));
    setImage((prev) => prev.filter((file) => URL.createObjectURL(file) !== imageId));
    setImagesUrl((prev) => prev.filter((url) => url !== imageId));
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
        images: [...imagesUrl, ...imageUrls],
      },
    });
    setImage([]);
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
    const imagesArray = hotel.images?.map((image) => {
      const id = String(image);
      return {
        id,
        jsx: (
          <div className="relative">
            <Image className="object-cover max-w-[552px] w-full max-h-[310px] h-full bg-slate-400" src={id} width={500} height={500} alt="image" />
            <X data-cy="Remove-Image-Button" onClick={() => removeImage(id)} className="absolute z-50 bg-white cursor-pointer top-1 right-1" width={32} height={32} />
          </div>
        ),
      };
    });
    if (imagesArray?.length) {
      setImages(imagesArray);
      setImagesUrl(imagesArray.map((image) => image.id));
    }
  }, [hotel.images]);

  return (
    <div className="max-w-[1920px] ">
      <Dialog open={open}>
        <DialogContent data-cy="Dialog-Element" className="max-w-[1160px] w-full  bg-blue-50 max-h-[800px] h-full overflow-scroll">
          <div>
            <p className="text-[20px] py-2 text-blue-700 font-semibold ">Images</p>
            <div className="grid grid-cols-2 gap-2 rounded-sm">
              <div>
                <div
                  className="relative flex justify-center
                bg-white border-gray-600 w-[552px] h-[310px] rounded-sm"
                >
                  <div className="flex flex-col items-center justify-center gap-2 border-gray-700">
                    <Plus />
                    <div className="">drag update photo</div>
                  </div>
                  <input data-cy="Image-Upload-Input" multiple onChange={showImage} className="absolute inset-0 opacity-0" type="file" />
                </div>
              </div>
              {images.map((image, index) => (
                <div key={image.id + index}>{image.jsx}</div>
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
