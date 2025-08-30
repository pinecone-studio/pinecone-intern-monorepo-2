
interface DialogActionsProps {
  file: File | null;
  isUploading: boolean;
  loading: boolean;
  onUpload: () => void;
  onClose: () => void;
}

export const DialogActions = ({ file, isUploading, loading, onUpload, onClose }: DialogActionsProps) => {
  return (
    <div className="p-4 border-t flex justify-end space-x-3">
      <button 
        onClick={onClose} 
        disabled={isUploading||loading} 
        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
      >
        Cancel
      </button>
      {file && (
        <button 
          onClick={onUpload} 
          disabled={isUploading||loading} 
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 flex items-center space-x-2"
        >
           Share Story
        </button>
      )}
    </div>
  );
};