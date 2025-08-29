import { X } from 'lucide-react';

interface FilePreviewProps {
  preview: string;
  file: File | null;
  onRemove: () => void;
}

export const FilePreview = ({ preview, file, onRemove }: FilePreviewProps) => {
  return (
    <div className="space-y-4 text-center">
      <div 
        className="relative bg-black rounded-lg overflow-hidden mx-auto" 
        style={{width:'200px', height:'356px'}}
      >
        <img src={preview} alt="preview" className="w-full h-full object-cover"/>
        <button 
          onClick={onRemove} 
          className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full"
        >
          <X size={16}/>
        </button>
      </div>
      <p className="text-sm text-gray-600">File: {file?.name}</p>
      <p className="text-sm text-gray-600">Size: {((file?.size||0)/1024).toFixed(1)}KB</p>
    </div>
  );
};