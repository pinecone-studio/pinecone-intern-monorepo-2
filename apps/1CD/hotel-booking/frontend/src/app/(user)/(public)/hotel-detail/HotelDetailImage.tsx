'use client';

import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader } from '../../../../components/providers/HotelBookingDialog';
import { X } from 'lucide-react';

const HotelDetailImage = ({ images, open, setIsOpenImageDialog }: { images: (string | null)[]; open: boolean; setIsOpenImageDialog: (_value: boolean) => void }) => {
  return (
    <div className="container items-center mx-auto">
      <Dialog open={open}>
        <DialogContent className=" flex flex-col gap-3 max-h-[1090px] overflow-y-scroll max-w-[1160px] w-full p-6">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="text-base font-bold text-foreground">Images</div>
              <button onClick={() => setIsOpenImageDialog(false)} className="outline-none" data-cy="image-detail-dialog-close">
                <X className="w-5 h-5" />
              </button>
            </div>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2" data-cy="Hotel-detail-image">
            {images.map((image, index) => (
              <Image key={String(image) + index} src={image || '/'} alt="hotel images" width={580} height={433} className="object-cover h-full max-h-[310px] col-span-1 rounded-sm" />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default HotelDetailImage;
