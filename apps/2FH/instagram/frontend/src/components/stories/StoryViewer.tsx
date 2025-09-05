import React from 'react';
import { demoImage, storyImage } from '../userProfile/mock-images';

interface Story {
  id: string;
  src: string;
  duration: number;
}

interface User {
  id: string;
  username: string;
  avatar: string;
  stories: Story[];
}

interface StoryViewerProps {
  user: User;
  story: Story | undefined;
  currentStory: number;
  progress: number;
  onPrevStory: () => void;
  onNextStory: () => void;
  onPrevUser: () => void;
  onNextUser: () => void;
  canGoPrev: boolean;
  isActive: boolean;
  onUserSelect?: () => void;
  nextUserTestId?: string;
  prevUserTestId?: string;
}

const StoryViewer: React.FC<StoryViewerProps> = ({ user, story, currentStory, progress, onPrevStory, onNextStory, onPrevUser, onNextUser, canGoPrev, isActive, onUserSelect }) => {
  if (isActive) {
    return (
      <div className="relative w-[521px] h-[927px]">
        <div className="absolute top-2 left-0 right-0 flex gap-1 px-2 z-10">
          {user.stories.map((s, i) => (
            <div key={s.id} className="flex-1 h-1 bg-black/50 rounded">
              <div
                className="h-1 bg-white rounded transition-all duration-100"
                style={{
                  width: i < currentStory ? '100%' : i === currentStory ? `${progress}%` : '0%',
                }}
              />
            </div>
          ))}
        </div>

        <img
          src={story?.src}
          alt="story"
          className="w-full h-full object-cover"
          data-testid="main-story-image"
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            e.currentTarget.src = storyImage;
          }}
        />

        <div className="absolute top-12 left-4 flex items-center z-10">
          <div className="p-[2px] rounded-full bg-gradient-to-r from-red-500 to-orange-500">
            <img
              src={user.avatar}
              alt={user.username}
              className="w-8 h-8 rounded-full object-cover"
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                e.currentTarget.src = demoImage;
              }}
            />
          </div>
          <span className="text-white ml-2 font-semibold text-sm">{user.username}</span>
        </div>

        <div data-testid="left-click-zone" className="absolute left-0 top-0 w-1/2 h-full cursor-pointer z-20" onClick={onPrevStory} />
        <div data-testid="right-click-zone" className="absolute right-0 top-0 w-1/2 h-full cursor-pointer z-20" onClick={onNextStory} />

        <button
          data-testid="prev-user-btn"
          onClick={onPrevUser}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-30 hover:bg-black/70 disabled:opacity-30"
          disabled={!canGoPrev}
        >
          ◀
        </button>
        <button data-testid="next-user-btn" onClick={onNextUser} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-30 hover:bg-black/70">
          ▶
        </button>
      </div>
    );
  }

  return (
    <div data-testid="preview-container" className="relative w-[245px] h-[433px] overflow-hidden rounded-xl shadow-lg cursor-pointer opacity-70" onClick={onUserSelect}>
      <img
        src={user.stories[0]?.src}
        alt="story"
        className="w-full h-full object-cover"
        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
          e.currentTarget.src = storyImage;
        }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30">
        <div className="p-[3px] rounded-full bg-gradient-to-r from-red-500 to-orange-500">
          <img
            src={user.avatar}
            alt={user.username}
            className="w-[56px] h-[56px] rounded-full object-cover"
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              e.currentTarget.src = demoImage;
            }}
          />
        </div>
        <p className="text-white mt-2 font-semibold text-[12px] max-w-[200px] truncate">{user.username}</p>
      </div>
    </div>
  );
};

export default StoryViewer;
