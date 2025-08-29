/* eslint-disable max-lines, complexity */
'use client';
import { avatar, avatar2, avatar3, avatar4, avatar5, storyImage, storyImage2, storyImage3, storyImage5, storyImage6, storyImage7 } from '@/components/stories/story-images';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useCallback, useMemo } from 'react';
const users = [
  {
    id: 1,
    username: 'user1',
    avatar: avatar,
    stories: [
      { id: 1, src: storyImage, duration: 5000 },
      { id: 2, src: storyImage2, duration: 5000 },
    ],
  },
  {
    id: 2,
    username: 'user2',
    avatar: avatar2,
    stories: [{ id: 1, src: storyImage3, duration: 5000 }],
  },
  {
    id: 3,
    username: 'user3',
    avatar: avatar3,
    stories: [{ id: 1, src: storyImage5, duration: 5000 }],
  },
  {
    id: 4,
    username: 'user4',
    avatar: avatar4,
    stories: [{ id: 1, src: storyImage6, duration: 5000 }],
  },
  {
    id: 5,
    username: 'user5',
    avatar: avatar5,
    stories: [{ id: 1, src: storyImage7, duration: 5000 }],
  },
];
const Stories = () => {
  const [currentUser, setCurrentUser] = useState(0);
  const [currentStory, setCurrentStory] = useState(0);
  const [progress, setProgress] = useState(0);
  const router = useRouter();
  
  const handleNextUser = useCallback(() => {
    if (currentUser < users.length - 1) {
      setCurrentUser(currentUser + 1);
      setCurrentStory(0);
    } else {
      router.push('/stories');
    }
  }, [currentUser, router]);

  const handlePrevUser = useCallback(() => {
    if (currentUser > 0) {
      setCurrentUser(currentUser - 1);
      setCurrentStory(users[currentUser - 1].stories.length - 1);
    }
  }, [currentUser]);

  const handleNextStory = useCallback(() => {
    if (currentStory < users[currentUser].stories.length - 1) {
      setCurrentStory(currentStory + 1);
    } else {
      handleNextUser();
    }
  }, [currentStory, currentUser, handleNextUser]);

  const handlePrevStory = useCallback(() => {
    if (currentStory > 0) {
      setCurrentStory(currentStory - 1);
    } else {
      handlePrevUser();
    }
  }, [currentStory, handlePrevUser]);

  const story = users[currentUser]?.stories?.[currentStory];
  
  useEffect(() => {
    if (!story || !users[currentUser]) return;
    
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          handleNextStory();
          return 0;
        }
        return p + 2;
      });
    }, story.duration / 50);
    return () => clearInterval(interval);
  }, [currentUser, currentStory, story, handleNextStory]);
  
  const visibleUsers = useMemo(() => {
    const visible = [];
    if (currentUser > 1) {
      visible.push(users[currentUser - 2]);
    }
    if (currentUser > 0) {
      visible.push(users[currentUser - 1]);
    }
    visible.push(users[currentUser]);
    if (currentUser < users.length - 1) {
      visible.push(users[currentUser + 1]);
    }
    if (currentUser < users.length - 2) {
      visible.push(users[currentUser + 2]);
    }
    return visible;
  }, [currentUser]);

  // Guard against invalid state
  if (!users[currentUser] || !users[currentUser].stories || !users[currentUser].stories[currentStory]) {
    return (
      <div className="w-full h-screen bg-[#18181b] flex flex-col items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-[#18181b] flex flex-col items-center ">
      <div className="w-full flex justify-between items-center p-4 text-white">
        <p className="text-white text-lg">Instagram</p>
        <button onClick={() => router.push('/')}>X</button>
      </div>
      <div className="flex-1 flex items-center justify-center gap-6 mt-6">
        {visibleUsers.map((user, _index) => (
          <div
            key={`${user.id}-${currentUser}-${currentStory}`}
            className={`relative flex flex-col items-center justify-center rounded-xl overflow-hidden transition-all duration-300
              ${user.id === users[currentUser].id ? 'w-[521px] h-[927px]' : 'w-[245px] h-[433px] opacity-70'}`}
          >
            {user.id === users[currentUser].id ? (
              <div className="relative w-full h-full">
                <div className="absolute top-2 left-0 right-0 flex gap-1 px-2">
                  {users[currentUser].stories.map((s, i) => (
                    <div key={s.id} className="flex-1 h-1 bg-black/50 rounded">
                      <div
                        className="h-1 bg-white rounded"
                        style={{
                          width: i < currentStory ? '100%' : i === currentStory ? `${progress}%` : '0%',
                        }}
                      />
                    </div>
                  ))}
                </div>
                <img src={users[currentUser].stories[currentStory].src} alt="story" className="w-full h-full object-cover" data-testid="main-story-image" />
                <div className="absolute left-0 top-0 w-1/2 h-full cursor-pointer" onClick={handlePrevStory} data-testid="prev-story-area" />
                <div className="absolute right-0 top-0 w-1/2 h-full cursor-pointer" onClick={handleNextStory} data-testid="next-story-area" />
                <button 
                  onClick={handlePrevUser} 
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-sm bg-blue-500 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  ◀
                </button>
                <button 
                  onClick={handleNextUser} 
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-sm bg-blue-500 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  ▶
                </button>
              </div>
            ) : (
              <div className="relative w-[245px] h-[433px] overflow-hidden rounded-xl shadow-lg">
                <img src={user.stories[0].src} alt="story" className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="p-[3px] rounded-full bg-gradient-to-r from-red-500 to-orange-500">
                    <img src={user.avatar} alt={user.username} className="w-[56px] h-[56px] rounded-full " />
                  </div>
                  <p className="text-white mt-2 font-semibold text-[12px]">{user.username}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default Stories;
