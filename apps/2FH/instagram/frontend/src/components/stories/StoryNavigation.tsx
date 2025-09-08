interface StoryNavigationProps {
  onPrev: () => void;
  onNext: () => void;
}

export const StoryNavigation = ({ onPrev, onNext }: StoryNavigationProps) => {
  return (
    <>
      <div 
        className="absolute left-0 top-0 w-1/2 h-full cursor-pointer z-20" 
        onClick={onPrev} 
        data-testid="prev-zone" 
      />
      <div 
        className="absolute right-0 top-0 w-1/2 h-full cursor-pointer z-20" 
        onClick={onNext} 
        data-testid="next-zone" 
      />
    </>
  );
};
