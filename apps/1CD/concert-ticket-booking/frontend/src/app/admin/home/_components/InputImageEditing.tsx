/* eslint-disable camelcase */
'use client';
import React, { useRef, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { EventInputType } from '@/utils/validation-schema';
import { Loader, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import axios from 'axios';
type FormProps = {
  form: UseFormReturn<EventInputType>;
};
const InputImageEditing = ({ form }: FormProps) => {
  const [image, setImage] = useState(form.getValues().image);
  const [uploading, setUploading] = useState(false);
  // const [setPublicId] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'concertpreset');
    setUploading(true);
    const response = await axios.post(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`, formData);
    setImage(response.data.secure_url);
    // setPublicId(response.data.public_id);
    form.setValue('image', response.data.secure_url);
    console.log('image', response.data.secure_url);
    setUploading(false);
  };
  const handleButtonClick = () => {
    fileInputRef.current!.click();
  };

  return (
    <div>
      <FormField
        control={form.control}
        name="image"
        render={() => (
          <FormItem className="relative" data-testid="image_input_container">
            <FormLabel className="text-xs" data-testid="image_input_label">
              Зураг оруулах <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <div className="mt-4 relative group">
                {image ? (
                  <div className="relative" data-testid="image_preview_container">
                    <img src={image} className="w-full h-[200px] object-cover rounded-sm bg-secondary" alt="Event Image" data-testid="image_preview" />
                    <button
                      type="button"
                      onClick={() => setImage('')}
                      className="absolute top-2 right-2 p-1 text-gray-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      data-testid="delete_image_button"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : uploading ? (
                  <div className="w-full h-[160px] bg-gray-200 flex items-center justify-center rounded-sm" data-testid="image_upload_loading">
                    <Loader />
                  </div>
                ) : (
                  <div className="w-full h-[160px] bg-gray-200 flex items-center justify-center rounded-sm" data-testid="image_upload_button_container">
                    <button
                      type="button"
                      onClick={handleButtonClick}
                      className="p-2 rounded-sm absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                      data-testid="image_upload_button"
                    >
                      <span className="text-blue-600"> +</span>
                      <br /> Зураг оруулах
                    </button>
                  </div>
                )}
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    handleImageUpload(e.target.files![0]);
                  }}
                  data-testid="file_input"
                />
              </div>
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};

export default InputImageEditing;
