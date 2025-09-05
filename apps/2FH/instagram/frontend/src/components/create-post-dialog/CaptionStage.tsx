'use client';
import { useAuth } from '@/contexts/AuthContext';

type CaptionStageProps = {
  caption: string;
  setCaption: (caption: string) => void;
};

export const CaptionStage = ({ caption, setCaption }: CaptionStageProps) => {
  const { user } = useAuth();

  return (
    <div className="flex border-l border-gray-200 ">
      <div className="w-full h-fit border-2 border-zinc-600/50 rounded-xs">
        <div className="w-full flex items-center justify-start gap-4 p-2">
          <img src={user?.profileImage} alt="" className="w-6 h-6 rounded-full" />
          <h1>{user?.userName}</h1>
        </div>
        <div className="w-fit ">
          <input dir="auto" value={caption} onChange={(e) => setCaption(e.target.value)} className="w-300 h-200 border-none p-2 focus:outline-none focus:border-transparent"></input>
        </div>
        <div className="flex text-zinc-500 justify-end">
          <p>{caption.length}</p>/<p>2200</p>
        </div>
      </div>
    </div>
  );
};
