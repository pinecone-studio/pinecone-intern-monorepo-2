'use client';
import { useEffect, useState } from 'react';
import { Dialog, DialogClose, DialogContent } from '@/components/ui/dialog';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { SelectFile } from './selectFileStage';
import { CropStage } from './CropStage';
import { CaptionStage } from './CaptionStage';
import { DialogContentHeader } from './contentHeader';
import { CircleCheckBig } from 'lucide-react';

const CREATE_POST_MUTATION = gql`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      _id
      image
      caption
      createdAt
      author
    }
  }
`;

type CreatePostDialogProps = {
  isPostDialogOpen: boolean;
  setIsPostDialogOpen: (_value: boolean) => void;
};

export const CreatePostDialog = ({ isPostDialogOpen, setIsPostDialogOpen }: CreatePostDialogProps) => {
  const [CreatePost] = useMutation(CREATE_POST_MUTATION);
  const [caption, setCaption] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const Stages = ['Create new post', 'Edit', 'Caption', 'Creating'];
  const [stage, setStage] = useState<string>(Stages[0]);
  const CLOUDINARY_UPLOAD_PRESET = 'intern-ig-hf-story';
  const CLOUDINARY_CLOUD_NAME = 'dhvup7uyy';

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    return data.secure_url;
  };

  useEffect(() => {
    if (selectedFiles.length > 0) {
      setStage(Stages[1]);
    }
  }, [selectedFiles]);

  useEffect(() => {
    if (!isPostDialogOpen) {
      setStage(Stages[0]);
      setCaption('');
      setSelectedFiles([]);
    }
  }, [isPostDialogOpen]);

  const handleCreatePost = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    try {
      const uploadPromises = selectedFiles.map(uploadToCloudinary);
      const imageUrls = await Promise.all(uploadPromises);
      const result = await CreatePost({
        variables: {
          input: {
            image: imageUrls,
            caption: caption.trim() || undefined,
          },
        },
      });
      console.log('Post created successfully:', result);
      setIsPostDialogOpen(false);
      setCaption('');
      setSelectedFiles([]);
      setStage(Stages[0]);
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setIsUploading(false);
    }
  };
  const isStage2 = stage === Stages[2];
  return (
    <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
      <DialogContent
        hideClose
        className={`backdrop-brightness-50 p-0 w-full justify-center items-center${
          Stages[3] === stage
            ? 'flex min-w-500 items-center'
            : isStage2
            ? 'flex w-fit max-w-5xl justify-between items-center '
            : Stages[1] === stage
            ? 'flex min-w-500 w-fit max-w-5xl p-0 items-center'
            : 'flex w-5xl p-0 items-center'
        }`}
      >
        <DialogClose className="fixed top-[-200px] right-[-500px] z-[60] w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-all cursor-pointer">
          ✕
        </DialogClose>
        {selectedFiles.length <= 0 && stage === Stages[0] ? (
          <SelectFile setSelectedFiles={setSelectedFiles} stage={stage} />
        ) : (
          <div className="">
            <DialogContentHeader
              stage={stage}
              selectedFiles={selectedFiles}
              handleCreatePost={handleCreatePost}
              Stages={Stages}
              isUploading={isUploading}
              setStage={setStage}
              setIsPostDialogOpen={setIsPostDialogOpen}
            />
            <div className={`${isStage2 && 'flex gap-4'}`}>
              {(stage === Stages[1] || isStage2) && <CropStage stage={stage} Stages={Stages} files={selectedFiles} setFiles={setSelectedFiles} />}
              {isStage2 && <CaptionStage caption={caption} setCaption={setCaption} />}
              {Stages[3] === stage && (
                <div className="w-full aspect-[2/3] flex flex-col">
                  <div className="w-full h-full flex flex-col items-center justify-center gap-6">
                    <CircleCheckBig size={50} />
                    <div>Your post has been shared.</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
