'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { toast } from 'sonner';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dz3pleqcg/upload';
const UPLOAD_PRESET = 'tinder';

type Props = {
  initialImages?: string[];
  max?: number;
  onChange?: (_images: string[]) => void;
  onSave?: (_images: string[]) => void;
};

const uploadSingleFile = async (file: File): Promise<string | null> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  const res = await fetch(CLOUDINARY_URL, { method: 'POST', body: formData });
  const data = await res.json();
  return data['secure_url'] || null;
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
  <button type="button" onClick={onClick} className={`w-1/2 py-3 text-sm font-semibold rounded-t-lg ${active ? 'text-pink-600 bg-white shadow-sm' : 'text-gray-500 bg-gray-50 hover:bg-gray-100'}`}>
    {children}
  </button>
);

const GridCell: React.FC<{
  src?: string;
  onRemove?: () => void;
  onAdd?: () => void;
}> = ({ src, onRemove, onAdd }) => (
  <div className={`relative aspect-square rounded-lg border-2 border-dashed ${src ? 'border-gray-300' : 'border-gray-300'} bg-white`}>
    {src ? (
      <>
        <img src={src} alt="profile" className="w-full h-full object-cover rounded-lg" />
        <button type="button" onClick={onRemove} className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border border-gray-300 text-gray-500 flex items-center justify-center shadow-sm">
          ✕
        </button>
      </>
    ) : (
      <button
        type="button"
        onClick={onAdd}
        className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-pink-500 text-white flex items-center justify-center shadow md:hover:opacity-90"
        aria-label="Add photo"
      >
        +
      </button>
    )}
  </div>
);

export const ProfilePhotosEditor: React.FC<Props & { userId?: string }> = ({ initialImages = [], max = 9, onChange, onSave, userId }) => {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<string[]>(initialImages.slice(0, max));
  const fileInputRef = useRef<HTMLInputElement>(null);

  const GET_PROFILE = gql`
    query GetProfileImages($userId: ID!) {
      getProfile(userId: $userId) {
        images
      }
    }
  `;
  const UPDATE_PROFILE = gql`
    mutation UpdateProfileImages($input: UpdateProfileInput!) {
      updateProfile(input: $input)
    }
  `;
  const { data } = useQuery(GET_PROFILE, { variables: { userId: userId as string }, skip: !userId });
  const [updateProfile] = useMutation(UPDATE_PROFILE);

  useEffect(() => {
    if (Array.isArray(data?.getProfile?.images)) {
      setImages(data.getProfile.images.slice(0, max));
    }
  }, [data?.getProfile?.images, max]);

  const emptySlots = useMemo(() => Math.max(0, max - images.length), [max, images.length]);

  const openPicker = () => fileInputRef.current?.click();

  const handleFiles = async (files: FileList) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const next: string[] = [...images];
      for (let i = 0; i < files.length && next.length < max; i++) {
        const url = await uploadSingleFile(files[i]);
        if (url) next.push(url);
      }
      setImages(next);
      onChange?.(next);
    } finally {
      setUploading(false);
    }
  };

  const removeAt = (index: number) => {
    const next = images.filter((_, i) => i !== index);
    setImages(next);
    onChange?.(next);
  };

  const handleSave = async () => {
    if (onSave) {
      onSave(images);
      return;
    }
    if (!userId) return;
    try {
      const res = await updateProfile({ variables: { input: { userId, images } } });
      if (res.data?.updateProfile === 'SUCCESS') {
        toast.success('Images saved');
      } else {
        toast.error('Failed to save images');
      }
    } catch {
      toast.error('Error saving images');
    }
  };

  return (
    <div className="w-full h-full bg-gray-50 rounded-lg shadow-sm">
      <div className="flex rounded-t-lg overflow-hidden border border-gray-200">
        <TabButton active={activeTab === 'edit'} onClick={() => setActiveTab('edit')}>
          Edit
        </TabButton>
        <TabButton active={activeTab === 'preview'} onClick={() => setActiveTab('preview')}>
          Preview
        </TabButton>
      </div>

      <div className="h-full border-x border-b border-gray-200 rounded-b-lg bg-white p-4 space-y-3">
        <h3 className="text-xs font-extrabold tracking-wider text-gray-800">PROFILE PHOTOS</h3>

        {activeTab === 'edit' ? (
          <>
            <div className="h-full grid grid-cols-3 border-2 border-gray-200 rounded-lg gap-3 p-3">
              {Array.from({ length: images.length }).map((_, idx) => (
                <GridCell key={`img-${idx}`} src={images[idx]} onRemove={() => removeAt(idx)} />
              ))}
              {Array.from({ length: emptySlots }).map((_, i) => (
                <GridCell key={`empty-${i}`} onAdd={openPicker} />
              ))}
            </div>

            <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={(e) => e.target.files && handleFiles(e.target.files)} />

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleSave}
                disabled={uploading}
                className={`px-6 py-2 rounded-full text-white font-semibold ${uploading ? 'bg-gray-300' : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:opacity-95'}`}
              >
                {uploading ? 'Uploading...' : 'Save'}
              </button>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: max }).map((_, idx) => (
              <div key={idx} className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                {images[idx] ? <img src={images[idx]} alt="preview" className="w-full h-full object-cover" /> : <span className="text-gray-300 text-sm">Empty</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePhotosEditor;
