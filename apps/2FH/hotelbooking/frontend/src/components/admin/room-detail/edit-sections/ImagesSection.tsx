/* eslint-disable  */
'use client';
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { X, Upload, Image as ImageIcon } from 'lucide-react';

interface ImagesSectionProps {
  room: any;
  handleInputChange: (field: string, value: any) => void;
}

export const ImagesSection = ({ room, handleInputChange }: ImagesSectionProps) => {
  const [previewImages, setPreviewImages] = useState<string[]>(
    Array.isArray(room.imageURL) ? room.imageURL.filter((img: string) => img !== null && img !== undefined && img !== '') : room.imageURL ? [room.imageURL] : []
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages: string[] = [];

      Array.from(files).forEach((file) => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const result = e.target?.result as string;
            newImages.push(result);

            if (newImages.length === files.length) {
              const updatedImages = [...previewImages, ...newImages];
              setPreviewImages(updatedImages);
              handleInputChange('imageURL', updatedImages);
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = previewImages.filter((_, i) => i !== index);
    setPreviewImages(updatedImages);
    handleInputChange('imageURL', updatedImages);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <Label>Room Images</Label>
        <div className="mt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleUploadClick}
            className="w-full h-32 border-2 border-dashed border-gray-300 hover:border-gray-400 flex flex-col items-center justify-center gap-2"
          >
            <Upload size={24} className="text-gray-400" />
            <span className="text-gray-600">Click to upload images</span>
            <span className="text-sm text-gray-400">PNG, JPG, GIF up to 10MB each</span>
          </Button>
          <Input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleFileUpload} className="hidden" />
        </div>
      </div>

      {previewImages.length > 0 && (
        <div>
          <Label>Image Previews ({previewImages.length})</Label>
          <div className="mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {previewImages.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={image}
                    alt={`Room image ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(index)}
                >
                  <X size={12} />
                </Button>
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 opacity-0 group-hover:opacity-100 transition-opacity">Image {index + 1}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {previewImages.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <ImageIcon size={48} className="mx-auto mb-2 text-gray-300" />
          <p>No images uploaded yet</p>
          <p className="text-sm">Upload images to preview them here</p>
        </div>
      )}
    </div>
  );
};
