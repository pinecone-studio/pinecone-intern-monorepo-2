import { Upload } from 'lucide-react';

interface FileUploadAreaProps {
  onFileSelect: (_file: File) => void;
  fileRef: React.RefObject<HTMLInputElement>;
}

export const FileUploadArea = ({ onFileSelect, fileRef }: FileUploadAreaProps) => {
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <div 
      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 cursor-pointer"
      onDragOver={handleDragOver} 
      onDrop={handleDrop} 
      onClick={() => fileRef.current?.click()}
    >
      <Upload size={48} className="mx-auto text-gray-400 mb-4" />
      <p className="text-gray-600 mb-2">Drag photos here</p>
      <p className="text-sm text-gray-500 mb-4">or click to select</p>
      <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
        Select file
      </button>
      <p className="text-xs text-gray-400 mt-2">9:16 format</p>
    </div>
  );
};