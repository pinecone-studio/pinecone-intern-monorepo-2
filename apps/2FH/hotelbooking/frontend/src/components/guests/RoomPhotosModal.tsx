/* eslint-disable  */
'use client';
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface RoomPhotosModalProps {
  roomImages: string[];
  roomName: string;
}

const RoomPhotosModal = ({ roomImages, roomName }: RoomPhotosModalProps) => {
  const [open, setOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const PLACEHOLDER_IMAGES = ['/placeholder-room-1.jpg', '/placeholder-room-2.jpg', '/placeholder-room-3.jpg', '/placeholder-room-4.jpg'];

  const getPlaceholderImages = () => PLACEHOLDER_IMAGES;

  // If no images provided, use placeholder images
  const images = roomImages && roomImages.length > 0 ? roomImages : getPlaceholderImages();

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="link" className="text-blue-600 p-0 h-auto">
          <span className="flex items-center">
            <span className="mr-1">👁️</span>
            View
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">{roomName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Main Image Display */}
          <div className="relative">
            <div className="relative h-96 w-full rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={images[currentImageIndex]}
                alt={`${roomName} - Image ${currentImageIndex + 1}`}
                fill
                className="object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-room-1.jpg';
                }}
              />
            </div>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={nextImage} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white" aria-label="Next image">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}

            {/* Image Counter */}
            {images.length > 1 && (
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                {currentImageIndex + 1} / {images.length}
              </div>
            )}
          </div>

          {/* Thumbnail Navigation */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`relative h-16 w-24 rounded overflow-hidden flex-shrink-0 border-2 transition-all ${
                    index === currentImageIndex ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-room-1.jpg';
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoomPhotosModal;
