interface StoryHeaderProps {
  onClose: () => void;
}

export const StoryHeader = ({ onClose }: StoryHeaderProps) => {
  return (
    <div className="w-full flex justify-between items-center text-white absolute top-0 left-0 px-4 py-2">
      <p className="text-lg">Instagram</p>
      <button 
        data-testid="close-stories-btn" 
        onClick={onClose} 
        className="hover:bg-gray-700 p-2 rounded text-xl"
      >
        ✕
      </button>
    </div>
  );
};
