'use client';
import { useEffect, useState, useMemo } from 'react';
import { Dialog, DialogClose, DialogContent } from '@/components/ui/dialog';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { CropStage } from './CropStage';
import { CaptionStage } from './CaptionStage';
import { CircleCheckBig } from 'lucide-react';
import { SelectFile } from './SelectFileStage';
import { DialogContentHeader } from './ContentHeader';

const CREATE_POST_MUTATION = gql`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      _id
      author {
        _id
      }
      image
      caption
      likes {
        _id
      }
      comments {
        _id
      }
      createdAt
      updatedAt
    }
  }
`;

type CreatePostDialogProps = {
  isPostDialogOpen: boolean;
  setIsPostDialogOpen: (_value: boolean) => void;
};

const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'intern-ig-hf-story');

  const response = await fetch(`https://api.cloudinary.com/v1_1/dhvup7uyy/image/upload`, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  return data.secure_url;
};

const CreatePostDialogComponent = ({ isPostDialogOpen, setIsPostDialogOpen }: CreatePostDialogProps) => {
  const [CreatePost] = useMutation(CREATE_POST_MUTATION);
  const [caption, setCaption] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const Stages = useMemo(() => ['Create new post', 'Edit', 'Caption', 'Creating'], []);
  const [stage, setStage] = useState<string>(Stages[0]);

  useEffect(() => {
    if (selectedFiles.length === 0) {
      setStage(Stages[0]);
    }
    if (selectedFiles.length > 0) {
      setStage(Stages[1]);
    }
  }, [selectedFiles, Stages]);
  useEffect(() => {
    if (!isPostDialogOpen) {
      setStage(Stages[0]);
      setCaption('');
      setSelectedFiles([]);
    }
  }, [isPostDialogOpen, Stages]);

  const uploadImages = async (): Promise<string[]> => {
    const uploadPromises = selectedFiles.map(uploadToCloudinary);
    return await Promise.all(uploadPromises);
  };
  const resetDialog = () => {
    setIsPostDialogOpen(false);
    setCaption('');
    setSelectedFiles([]);
    setStage(Stages[0]);
  };

  const handleCreatePost = async () => {
    setIsUploading(true);
    try {
      const imageUrls = await uploadImages();
      const result = await CreatePost({
        variables: {
          input: {
            image: imageUrls,
            caption: caption.trim() || undefined,
          },
        },
      });
      console.log('Post created successfully:', result);
      resetDialog();
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setIsUploading(false);
    }
  };
  const getDialogClassName = () => {
    const baseClass = 'backdrop-brightness-50 p-0 w-full justify-center items-center';
    if (stage === Stages[3]) return `${baseClass} flex min-w-500 items-center`;
    if (stage === Stages[2]) return `${baseClass} flex w-fit max-w-5xl justify-between items-center`;
    if (stage === Stages[1]) return `${baseClass} flex min-w-500 w-fit max-w-5xl p-0 items-center`;
    return baseClass;
  };

  const shouldShowCropStage = stage === Stages[1] || stage === Stages[2];
  const shouldShowCaptionStage = stage === Stages[2];
  const shouldShowSuccessMessage = Stages[3] === stage;

  const renderMainContent = () => (
    <div className={`${stage === Stages[2] && 'flex gap-4'}`}>
      {shouldShowCropStage && <CropStage stage={stage} Stages={Stages} files={selectedFiles} setFiles={setSelectedFiles} />}
      {shouldShowCaptionStage && <CaptionStage caption={caption} setCaption={setCaption} />}
      {shouldShowSuccessMessage && (
        <div className="w-full aspect-[2/3] flex flex-col">
          <div className="w-full h-full flex flex-col items-center justify-center gap-6">
            <CircleCheckBig size={50} />
            <div>Your post has been shared.</div>
          </div>
        </div>
      )}
    </div>
  );

  const renderDialogContent = () => {
    if (selectedFiles.length <= 0 && stage === Stages[0]) {
      return <SelectFile stage={stage} selectedFiles={selectedFiles} onFileSelect={setSelectedFiles} />;
    }

    return (
      <div className="">
        <DialogContentHeader stage={stage} handleCreatePost={handleCreatePost} Stages={Stages} isUploading={isUploading} setStage={setStage} setIsPostDialogOpen={setIsPostDialogOpen} />
        {renderMainContent()}
      </div>
    );
  };

  return (
    <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
      <DialogContent hideClose className={getDialogClassName()}>
        <DialogClose className="fixed top-[-200px] right-[-500px] z-[60] w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-all cursor-pointer">
          ✕
        </DialogClose>
        {renderDialogContent()}
      </DialogContent>
    </Dialog>
  );
};

export const CreatePostDialog = CreatePostDialogComponent;
