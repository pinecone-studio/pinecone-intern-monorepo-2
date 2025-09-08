interface StoryProgressBarsProps {
  storiesLength: number;
  currentIndex: number;
  progress: number;
}

export const StoryProgressBars = ({ storiesLength, currentIndex, progress }: StoryProgressBarsProps) => {
  return (
    <div className="absolute top-2 left-0 right-0 flex gap-1 px-2 z-10">
      {Array.from({ length: storiesLength }, (_, i) => (
        <div key={i} className="flex-1 h-1 bg-black/50 rounded">
          <div
            className="h-1 bg-white rounded transition-all duration-100"
            style={{
              width: i < currentIndex ? '100%' : i === currentIndex ? `${progress}%` : '0%',
            }}
          />
        </div>
      ))}
    </div>
  );
};
